import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from './auth.controller';
import { HashService } from "./hashing/hashing.service";
import { UserService } from "./user/user.service";
import { PrismaService } from "./prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60m' },
          }),],
    providers: [AuthService, LocalStrategy, HashService, UserService, PrismaService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}