import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AccountSummary } from './account.types';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<Account> {
    return this.prisma.account.findUnique({
      where: { name },
    });
  }

  async getNonSuperAdminAccounts(): Promise<AccountSummary[]> {
    return this.prisma.account.findMany({
      where: {
        isSuperAdmin: false,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(name: string, password: string): Promise<AccountSummary> {
    const existing = await this.findByName(name);
    if (existing) {
      throw new BadRequestException('Account already exist with this name');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.account.create({
      select: {
        id: true,
        name: true,
      },
      data: { name, password: hashedPassword },
    });
  }

  async changePassword(
    id: number,
    password: string,
  ): Promise<{ message: string }> {
    const account = await this.prisma.account.findUnique({
      where: { id: id },
    });
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.account.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return { message: 'Password updated' };
  }

  verifyAccountOwnership(requestAccountId: number, resourceAccountId: number) {
    if (requestAccountId !== resourceAccountId) {
      throw new ForbiddenException('You do not have access to this resource');
    }
  }
}
