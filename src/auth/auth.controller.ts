import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user/user.service';
import { User as UserModel } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@Controller()
export class AuthController {
    constructor( private userService: UserService, private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.issueJwtToken(req.user);
    };

    @Post('signup')
    async signupUser(
        @Body() userData: { email: string; passwort: string },
    ): Promise<UserModel> {
        return this.userService.createUser(userData);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return this.userService.user({id: req.user.userId});
    }
}

