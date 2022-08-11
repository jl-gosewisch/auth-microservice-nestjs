
import { Injectable } from '@nestjs/common';
import { HashService } from './hashing/hashing.service';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private hashingService: HashService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.user({email});
    if(user && await this.hashingService.comparePassword(pass, user.passwort)) {
        const { passwort, ...result } = user;
        return result;
    }
    return null;
  }
}
