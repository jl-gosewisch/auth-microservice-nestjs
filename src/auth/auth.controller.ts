import { Controller, Request, Get, Post, UseGuards, Body, HttpException, HttpStatus } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { RefreshTokenGuard } from './guards/jwt-refresh-guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AuthController {
    constructor( private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/local/signin')
    async login( @Request() req ) {
        return this.authService.login(req.user.userId);
    };

    @Post('auth/local/signup')
    async signupUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<HttpException> {
        const user = this.authService.createUser(createUserDto);
        if (!user) throw new HttpException('Internal Server Error: Could not create User', HttpStatus.INTERNAL_SERVER_ERROR);
        throw new HttpException('User created', HttpStatus.CREATED)
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

