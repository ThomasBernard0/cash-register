import { Controller, Post, Body, UseGuards, Put, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SuperAdminGuard } from 'src/auth/superadmin.guard';
import {
  AccountSummary,
  ChangePasswordDto,
  CreateAccountDto,
} from './account.types';

@Controller('api/account')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  async findAllNonSuperAdmins(): Promise<AccountSummary[]> {
    return await this.accountService.getNonSuperAdminAccounts();
  }

  @Post()
  async create(@Body() body: CreateAccountDto): Promise<AccountSummary> {
    return this.accountService.create(body.name, body.password);
  }

  @Put('/password')
  async changePassword(
    @Body() body: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.accountService.changePassword(body.id, body.password);
  }
}
