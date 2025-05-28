import { BadRequestException, Injectable } from '@nestjs/common';
import { Session, SessionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommandService {
  constructor(private prisma: PrismaService) {}

  async createCommand(accountId: number): Promise<Session> {
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
