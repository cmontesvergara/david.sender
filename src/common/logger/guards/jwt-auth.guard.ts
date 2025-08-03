import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  client;
  constructor() {
    this.client = jwksClient({
      jwksUri: `${process.env.SSO_HOST}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    });
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = auth.split(' ')[1];
    return new Promise((resolve, reject) => {
      let jwtVerify: any;
      try {
        jwtVerify = jwt.verify(token, this.getKey.bind(this), {
          algorithms: ['RS256'],
          //audience: process.env.SSO_AUDIENCE,// Uncomment if you want to enforce audience
          issuer: process.env.SSO_DOMAIN,
        });
      } catch (error: any) {
        return reject(new UnauthorizedException(error.message));
      }

      const tokenAud = jwtVerify!.aud;

      if (Array.isArray(tokenAud)) {
        if (!tokenAud.includes(process.env.CURRENT_HOST as string)) {
          return reject(new Error('Audiencia inválida para esta API'));
        }
      } else if (typeof tokenAud === 'string') {
        const auds = tokenAud.split(',');
        if (!auds.includes(process.env.CURRENT_HOST as string)) {
          return reject(new Error('Audiencia inválida para esta API'));
        }
      } else {
        return reject(new Error('Formato de audiencia inválido'));
      }
      req.user = tokenAud;
      resolve(true);
    });
  }
  private getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    this.client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      callback(err, signingKey);
    });
  }
}
