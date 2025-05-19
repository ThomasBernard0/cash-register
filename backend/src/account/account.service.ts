import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, password: string) {
    return this.prisma.account.create({
      data: { name, password },
    });
  }

  async findByName(name: string) {
    return this.prisma.account.findUnique({
      where: { name },
    });
  }
}
