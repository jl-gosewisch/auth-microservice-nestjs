import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user/user.service';
import { User as UserModel } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@Controller()
export class AuthController {
    constructor( private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/local/signin')
    async login(@Request() req) {
        return this.authService.login(req.user);
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
     
    @Post('auth/refresh')
    async refresh() {
        return this.authService.refresh()
    }
    

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return this.authService.testUserReturnRoute({id: req.user.userId});
    }
}

