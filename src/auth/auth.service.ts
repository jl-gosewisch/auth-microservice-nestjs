
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { HashService } from './hashing/hashing.service';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private hashingService: HashService, 
    private jwtService:JwtService
    ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.user({email});
    if(user && await this.hashingService.comparePassword(pass, user.hash)) {
        const { hash, ...result } = user;
        return result;
    }
    return null;
  }

  async login(user: User) {
    const currentUser = await this.usersService.user({email : user.email});
    if (!currentUser) throw new BadRequestException('User does not exist');
    const passwordMatches = this.hashingService.comparePassword(user.hash, currentUser.hash)
    if (!passwordMatches) throw new BadRequestException('Passwort incorrect')
    const tokens = await this.createTokens(currentUser.id)
    const hashedRefreshToken: string = await this.hashingService.hashJWT(tokens.refreshToken);
    await this.updateRefreshToken(currentUser.id, hashedRefreshToken)
    return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      }
  }

  async createUser(userData: Prisma.UserCreateInput) {
    return this.usersService.createUser(userData)
  }

  async testUserReturnRoute(id: Prisma.UserWhereUniqueInput) {
    return this.usersService.user(id)
  }

  async createTokens(userId) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({sub: userId}),
      this.jwtService.signAsync({sub: userId}, {expiresIn: 60*60*24})
    ]);
    return {
      accessToken,
      refreshToken
    }
  }

  async updateRefreshToken(userId, hashedRefreshToken: string) {
    await this.usersService.updateUser({
      where: {
        id: userId
      },
      data: {
        hashedRefreshToken
      }
    })
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.user({id: userId});
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await this.hashingService.compareRefreshTokenWithHash(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.createTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  

  async logout(id: string) {
    try {
      this.usersService.updateUser({
        where: {
          id
        },
        data: {
          hashedRefreshToken: null
        }
      })
    } catch (err) {
      // TODO: Implement Error Handling
    }
    return {
      success: true
    }
  }

  async refresh() {
    return null
  }
}
