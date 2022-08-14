import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwtAccessSecretConfig from '../config/jwt-access-secret.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtAccessSecretConfig().accessSecret
    });
  }
  private logger = new Logger(JwtStrategy.name)

  async validate(payload: any) {
    this.logger.log('Request', payload);
    return { userId: payload.sub };
  }
}
