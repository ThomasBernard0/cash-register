import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string) {
    return this.prisma.account.findUnique({
      where: { name },
    });
  }

  async getAllAccounts() {
    return this.prisma.account.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(name: string, password: string) {
    const existing = await this.findByName(name);
    if (existing) {
      throw new BadRequestException('Account already exist with this name');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.account.create({
      data: { name, password: hashedPassword },
    });
    return { message: 'Account created' };
  }

  async changePassword(id: number, password: string) {
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
}
