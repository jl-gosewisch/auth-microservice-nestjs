import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from './auth.controller';
import { HashService } from "./hashing/hashing.service";
import { UserService } from "./user/user.service";
import { PrismaService } from "./prisma/prisma.service";

@Module({
    imports: [PassportModule],
    providers: [AuthService, LocalStrategy, HashService, UserService, PrismaService],
    controllers: [AuthController]
})
export class AuthModule {}