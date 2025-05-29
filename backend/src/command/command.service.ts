import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommandDto } from './command.dto';
import { SessionService } from 'src/session/session.service';
import { CommandStatus, CommandType } from '@prisma/client';

@Injectable()
export class CommandService {
  constructor(
    private prisma: PrismaService,
    private sessionService: SessionService,
  ) {}

  async createCommand(accountId: number, command: CommandDto): Promise<{}> {
    const activeSession = await this.sessionService.getActiveSession(accountId);
    if (!activeSession) throw new BadRequestException('No active session');

    try {
      const dbProducts = await this.prisma.item.findMany({
        where: { id: { in: command.items.map((i) => i.idItem) } },
      });
      const itemsWithPrice = command.items.map((item) => {
        const product = dbProducts.find((p) => p.id === item.idItem);
        if (!product) throw new BadRequestException('Invalid product');
        return {
          label: product.label,
          priceInCent: product.priceInCent,
          quantity: item.quantity,
          total: product.priceInCent * item.quantity,
        };
      });
      const totalPrice = itemsWithPrice.reduce((sum, i) => sum + i.total, 0);

      await this.prisma.command.create({
        data: {
          session: { connect: { id: activeSession.id } },
          totalPriceInCent: totalPrice,
          type: CommandType.internal,
          status: CommandStatus.validated,
          items: {
            create: itemsWithPrice.map((item) => ({
              label: item.label,
              priceInCent: item.priceInCent,
              quantity: item.quantity,
            })),
          },
        },
      });

      await this.prisma.session.update({
        where: { id: activeSession.id },
        data: {
          totalRevenueInCent: {
            increment: totalPrice,
          },
        },
      });

      return { message: 'Commande créée avec succès.' };
    } catch (error) {
      throw new BadRequestException('Failed to create command');
    }
  }
}
