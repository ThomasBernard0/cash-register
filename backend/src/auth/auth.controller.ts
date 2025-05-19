import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SuperAdminGuard } from './superadmin.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async register(@Body() body: { name: string; password: string }) {
    return this.authService.register(body.name, body.password);
  }

  @Post('login')
  async login(@Body() body: { name: string; password: string }) {
    return this.authService.loginWithCredentials(body.name, body.password);
  }
}
