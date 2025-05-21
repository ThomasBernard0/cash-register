import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async login(name: string, password: string) {
    const account = await this.accountService.findByName(name);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...result } = account;
    const payload = {
      sub: result.id,
      name: result.name,
      isSuperAdmin: result.isSuperAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
