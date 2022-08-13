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
      secretOrKey: 'test321',
      passReqToCallback: true,
      /* 
      Proper Way!:
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN')
      */
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

