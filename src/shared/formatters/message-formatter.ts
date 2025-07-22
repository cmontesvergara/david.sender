type MessageMeta = {
  title?: string;
  type?: string;
};

interface MessageFormatterPayload {
  phone?: string;
  countryCode?: string;
  payload: {
    body: Record<string, any>;
    meta?: MessageMeta;
    footer?: string;
  };
}

export class MessageFormatter {
  constructor(
    private data: MessageFormatterPayload,
    private labelMap?: Record<string, string>,
    private options?: {
      flatten?: boolean;
      parseUrl?: boolean;
      [key: string]: any;
    },
  ) {}

  public toMarkdown(): string {
    const body = this.data.payload?.body ?? {};
    const meta = this.data.payload?.meta ?? {};
    const footer = this.data.payload?.footer ?? undefined;

    const metaTitle = meta.title ?? '📢 Notificación';
    const metaType = meta.type ?? 'INFO';

    let emoji = '';
    switch (metaType.toUpperCase()) {
      case 'ALERTA':
        emoji = '🚨';
        break;
      case 'INFO':
        emoji = 'ℹ️';
        break;
      case 'ERROR':
        emoji = '❌';
        break;
      default:
        emoji = '🔔';
    }

    const header = `*${metaTitle}* ${emoji}`;
    const bodyLines = this.options?.flatten
      ? this.formatBodyFlatMarkdown(body)
      : this.formatBodyMarkdown(body);
    const footerLine = footer ? `\n${footer}` : '';

    return [header, '', ...bodyLines, '', footerLine]
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  private formatBodyMarkdown(body: Record<string, any>, prefix = ''): string[] {
    return Object.entries(body).flatMap(([key, value]) => {
      console.log('key', key);
      const label = this.getLabel(key);
      const emoji = this.getEmojiForKey(key);
      const formattedKey = `*${prefix}${emoji} ${label}:*`;

      if (typeof value === 'object' && value !== null) {
        return [
          `${formattedKey}`,
          ...this.formatBodyMarkdown(value, prefix + '  '),
        ];
      }

      return [this.formatValueMarkdown(formattedKey, value)];
    });
  }

  private formatBodyFlatMarkdown(
    body: Record<string, any>,
    parentKey = '',
  ): string[] {
    return Object.entries(body).flatMap(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        return this.formatBodyFlatMarkdown(value, fullKey);
      }

      const label = this.getLabel(fullKey);
      const emoji = key.includes('empty') ? '' : this.getEmojiForKey(key);
      const formattedKey = key.includes('empty') ? '' : `*${emoji} ${label}:*`;
      return [this.formatValueMarkdown(formattedKey, value)];
    });
  }

  private formatValueMarkdown(label: string, value: any): string {
    const stringValue = String(value);
    if (this.isURL(stringValue) && this.options?.parseUrl) {
      return `${label} [${stringValue}](${stringValue})`;
    }
    return `${label} ${stringValue}`;
  }

  private isURL(value: string): boolean {
    return /^https?:\/\/[\w./?=#&%-]+$/i.test(value);
  }

  private getEmojiForKey(key: string): string {
    const emojiMap: Record<string, string> = {
      otp: '🔐',
      code: '🔑',
      usuario: '👤',
      username: '👤',
      name: '📛',
      fecha: '📅',
      date: '📅',
      time: '🕐',
      session: '🧾',
      email: '📧',
      location: '📍',
      amount: '💵',
      price: '💰',
      status: '📊',
      id: '🆔',
      link: '🔗',
      url: '🌐',
      expiresin: '⏳',
      message: '💬',
      empty: '',
    };

    const normalizedKey = key.toLowerCase();
    return emojiMap[normalizedKey] || '▪️';
  }

  private getLabel(key: string): string {
    return this.labelMap?.[key] ?? key;
  }
}
