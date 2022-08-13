import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
      // Only for local testing
      secretOrKey: 'test321'
      /* 
      Proper Way!:
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN')
      */
    });
  }
  private logger = new Logger(RefreshTokenStrategy.name)

  validate(req: Request, payload: any) {
    this.logger.log('Request:', req)
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      refreshToken,
    }
  }
}

