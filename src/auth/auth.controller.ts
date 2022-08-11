import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user/user.service';
import { User, User as UserModel } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
    constructor( private userService: UserService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return req.user;
    };

    @Post('signup')
    async signupUser(
        @Body() userData: { email: string; passwort: string },
    ): Promise<UserModel> {
        return this.userService.createUser(userData);
    }
}

