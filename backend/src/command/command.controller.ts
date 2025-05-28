import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommandService } from './command.service';

@Controller('api/commands')
@UseGuards(JwtAuthGuard)
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Post()
  async createCommand(@Req() req) {
    const accountId: number = req.user.sub;
    return this.commandService.createCommand(accountId);
  }
}
