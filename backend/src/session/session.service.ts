import { BadRequestException, Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async getSessionActive(accountId: number): Promise<Session> {
    try {
      const activeSession = await this.prisma.session.findFirst({
        where: { accountId, status: 'active' },
      });
      return activeSession ?? null;
    } catch (error) {
      throw new BadRequestException('Failed to fetch active session');
    }
  }
}
