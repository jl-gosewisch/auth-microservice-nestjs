import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Only for local testing
      secretOrKey: 'test123'
      /* 
      Proper Way!:
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN')
      */
    });
  }
  private logger = new Logger(JwtStrategy.name)

  async validate(payload: any) {
    this.logger.log('Request', payload);
    return { userId: payload.sub };
  }
}
