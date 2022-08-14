import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwtRefreshSecretConfig from '../config/jwt-refresh-secret.config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtRefreshSecretConfig().refreshSecret,
      passReqToCallback: true
      
    });
  }
  private logger = new Logger(RefreshTokenStrategy.name)

  validate(request: Request, payload: any) {
    this.logger.log('Request:', request.get('authorization'))
    const refreshToken = request
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      userId: payload.sub,
      refreshToken,
    }
  }
}

