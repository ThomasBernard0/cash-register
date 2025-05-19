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

  async loginWithCredentials(name: string, password: string) {
    const account = await this.accountService.findByName(name);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...result } = account;
    return this.login(result);
  }

  async register(name: string, password: string) {
    const existingAccount = await this.accountService.findByName(name);
    if (existingAccount) {
      throw new ForbiddenException('Name already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await this.accountService.create(name, hashedPassword);
    return this.login(account);
  }

  async login(account: any) {
    const payload = {
      sub: account.id,
      name: account.name,
      isSuperAdmin: account.isSuperAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
