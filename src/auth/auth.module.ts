import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from './auth.controller';
import { HashService } from "./hashAndCrypto/hashing.service";
import { UserService } from "./user/user.service";
import { PrismaService } from "./prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshTokenStrategy } from "./strategies/jwt-refresh-strategy";

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
            signOptions: { expiresIn: '5m' }
          }),],
    providers: [AuthService, LocalStrategy, HashService, UserService, PrismaService, JwtStrategy, RefreshTokenStrategy],
    controllers: [AuthController]
})
export class AuthModule {}