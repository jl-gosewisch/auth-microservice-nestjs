import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { RefreshTokenGuard } from './guards/jwt-refresh-guard';

@Controller()
export class AuthController {
    constructor( private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/local/signin')
    async login(
        @Body() userData: { email: string; hash: string },
    ) {
        return this.authService.login(userData);
    };

    @Post('auth/local/signup')
    async signupUser(
        @Body() userData: { email: string; hash: string },
    ): Promise<UserModel> {
        return this.authService.createUser(userData);
    }

    @UseGuards(JwtAuthGuard)
    @Post('auth/logout')
    async logout(@Request() req) {
        return this.authService.logout(req.user.userId)
    }
     
    // TODO: Understand the logic of passport strategies in nest better
    @UseGuards(RefreshTokenGuard)
    @Post('auth/refresh')
    async refreshTokens(@Request() req) {
        return this.authService.refreshTokens(req.user.userId, req.user.refreshToken);
    }
    

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.authService.testUserReturnRoute(req.user.userId);
    }
}

