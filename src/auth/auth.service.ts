
import { Injectable } from '@nestjs/common';
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
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({sub: user.id}),
      this.jwtService.signAsync({sub: user.id}, {expiresIn: 60*60*24})
    ]);
    const hashedRefreshToken: string = await this.hashingService.hashJWT(refreshToken);
    await this.usersService.updateUser({
      where: {
        id: user.id
      },
      data: {
        hashedRefreshToken
      }
    })
    return {
        access_token: accessToken,
        refresh_token:refreshToken
      }
  }

  async createUser(userData: Prisma.UserCreateInput) {
    return this.usersService.createUser(userData)
  }

  async testUserReturnRoute(id: Prisma.UserWhereUniqueInput) {
    return this.usersService.user(id)
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
