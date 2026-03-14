import {
  AuthenticationCreds,
  AuthenticationState,
  BufferJSON,
  SignalDataTypeMap,
  initAuthCreds,
  proto
} from '@whiskeysockets/baileys';
import Redis from 'ioredis';

// A function to mimic useMultiFileAuthState but for Redis
export const useRedisAuthState = async (
  redis: Redis,
  agentId: string,
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {
  const PREFIX = `baileys:session:${agentId}`;

  const writeData = async (key: string, data: any): Promise<void> => {
    try {
      const value = JSON.stringify(data, BufferJSON.replacer);
      await redis.set(`${PREFIX}:${key}`, value);
    } catch (error) {
      console.error(
        `[RedisAuthState] Error escribiendo la clave ${key}:`,
        error,
      );
    }
  };

  const readData = async (key: string): Promise<any | null> => {
    try {
      const data = await redis.get(`${PREFIX}:${key}`);
      return data ? JSON.parse(data, BufferJSON.reviver) : null;
    } catch (error) {
      console.error(`[RedisAuthState] Error leyendo la clave ${key}:`, error);
      return null;
    }
  };

  const removeData = async (key: string): Promise<void> => {
    try {
      await redis.del(`${PREFIX}:${key}`);
    } catch (error) {
      console.error(
        `[RedisAuthState] Error eliminando la clave ${key}:`,
        error,
      );
    }
  };

  const credsData = await readData('creds');
  const creds: AuthenticationCreds = credsData || initAuthCreds();

  // Guardar credenciales iniciales de inmediato si son nuevas para asegurar persistencia
  if (!credsData) {
    await writeData('creds', creds);
  }

  return {
    state: {
      creds,
      keys: {
        get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
          const data: { [key: string]: SignalDataTypeMap[T] } = {};
          await Promise.all(
            ids.map(async (id) => {
              const value = await readData(`${type}-${id}`);
              if (value) {
                // Si es un app-state-sync-key, asegurar formato proto con buffers correctos
                if (type === 'app-state-sync-key' && value.syncKey) {
                  value.syncKey = Buffer.from(value.syncKey.data || value.syncKey);
                  data[id] = proto.Message.AppStateSyncKeyData.fromObject(value) as unknown as SignalDataTypeMap[T];
                } else {
                  data[id] = value as SignalDataTypeMap[T];
                }
              }
            }),
          );
          return data;
        },
        set: async (data: any) => {
          const tasks: Promise<void>[] = [];
          for (const category of Object.keys(data)) {
            for (const id of Object.keys(data[category])) {
              const value = data[category][id];
              const key = `${category}-${id}`;
              if (value) {
                tasks.push(writeData(key, value));
              } else {
                tasks.push(removeData(key));
              }
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => writeData('creds', creds),
  };
};
