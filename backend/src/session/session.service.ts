import { BadRequestException, Injectable } from '@nestjs/common';
import { Session, SessionStatus } from '@prisma/client';
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

  async createActiveSession(accountId: number): Promise<Session> {
    const activeSession = await this.getActiveSession(accountId);
    if (activeSession)
      throw new BadRequestException('There is already an active session');

    try {
      const newSession = await this.prisma.session.create({
        data: {
          accountId,
          totalRevenueInCent: 0,
          status: SessionStatus.active,
        },
      });
      return newSession;
    } catch (error) {
      throw new BadRequestException('Failed to create an active session');
    }
  }

  async closeActiveSession(accountId: number): Promise<Session> {
    const activeSession = await this.getActiveSession(accountId);
    if (!activeSession)
      throw new BadRequestException('Active session not found');

    try {
      return this.prisma.session.update({
        where: { id: activeSession.id },
        data: { status: SessionStatus.completed },
      });
    } catch (error) {
      throw new BadRequestException('Failed to close active session');
    }
  }

  async getActiveSession(accountId: number): Promise<Session> {
    try {
      return await this.prisma.session.findFirst({
        where: { accountId, status: SessionStatus.active },
      });
    } catch {
      throw new BadRequestException('Failed to get active session');
    }
  }
}
