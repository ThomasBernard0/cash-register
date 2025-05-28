import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionService } from './session.service';

@Controller('api/sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('active')
  async getActiveSession(@Req() req) {
    const accountId: number = req.user.sub;
    return this.sessionService.getSessionActive(accountId);
  }

  @Post('open')
  async openSession(@Req() req) {
    const accountId: number = req.user.sub;
    return this.sessionService.createActiveSession(accountId);
  }

  @Patch('close')
  async closeSession(@Req() req) {
    const accountId: number = req.user.sub;
    return this.sessionService.closeActiveSession(accountId);
  }
}
