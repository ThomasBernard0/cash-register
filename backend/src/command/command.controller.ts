import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommandService } from './command.service';
import { CommandDto } from './command.dto';

@Controller('api/commands')
@UseGuards(JwtAuthGuard)
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Post()
  async createCommand(@Body() command: CommandDto, @Req() req) {
    const accountId: number = req.user.sub;
    return this.commandService.createCommand(accountId, command);
  }
}
