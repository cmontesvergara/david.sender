import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  client;
  constructor(private readonly configService: ConfigService) {
    this.client = jwksClient({
      jwksUri: `${this.configService.get<string>('SSO_HOST')}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    });
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    console.log('Current NODE_ENV (via ConfigService):', `|${nodeEnv}|`);

    if (nodeEnv?.trim().replace(/['"]/g, '') !== 'production') {
      console.log('Bypassing JwtAuthGuard in non-production environment');
      return true;
    }
    console.log('Validating JWT in production environment...');
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = auth.split(' ')[1].trim();
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.getKey.bind(this),
        {
          algorithms: ['RS256'],
          issuer: this.configService.get<string>('SSO_FRONT_HOST') as string,
        },
        (err, decoded: any) => {
          if (err) {
            console.error('JWT verification error:', err);
            return reject(new UnauthorizedException(err.message));
          }

          const tokenAud = decoded.aud;
          const currentHost = this.configService.get<string>('CURRENT_HOST') || '';

          if (Array.isArray(tokenAud)) {
            if (!tokenAud.includes(currentHost)) {
              return reject(
                new UnauthorizedException('Audiencia inválida para esta API'),
              );
            }
          } else if (typeof tokenAud === 'string') {
            const auds = tokenAud.split(',');
            if (!auds.includes(currentHost)) {
              return reject(
                new UnauthorizedException('Audiencia inválida para esta API'),
              );
            }
          } else {
            return reject(
              new UnauthorizedException('Formato de audiencia inválido'),
            );
          }

          req.user = decoded;
          resolve(true);
        },
      );
    });
  }
  private getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    this.client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      //console.log('Signing key:', err, signingKey);
      callback(err, signingKey);
    });
  }
}
