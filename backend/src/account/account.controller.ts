import { Controller, Post, Body, UseGuards, Put, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SuperAdminGuard } from 'src/auth/superadmin.guard';

@Controller('api/account')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AuthController {
  constructor(private accountService: AccountService) {}

  @Get()
  async findAll() {
    return await this.accountService.getAllAccounts();
  }

  @Post()
  async create(@Body() body: { name: string; password: string }) {
    return this.accountService.create(body.name, body.password);
  }

  @Put('/password')
  async changePassword(@Body() body: { id: number; password: string }) {
    return this.accountService.changePassword(body.id, body.password);
  }
}
