
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
    let payload = {sub: user.id};
    return {
        access_token: this.jwtService.sign(payload),
      }
  }

  async createUser(userData: Prisma.UserCreateInput) {
    return this.usersService.createUser(userData)
  }

  async testUserReturnRoute(id: Prisma.UserWhereUniqueInput) {
    return this.usersService.user(id)
  }

  async logout() {
    return null
  }

  async refresh() {
    return null
  }
}
