import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Item, Section } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateItemDto,
  CreateSectionDto,
  OrderSectionDto,
  UpdateItemDto,
  UpdateSectionDto,
} from './section.dto';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async getAllSectionsWithItems(accountId: number): Promise<Section[]> {
    try {
      return await this.prisma.section.findMany({
        where: { accountId },
        include: {
          items: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch sections');
    }
  }

  async getSectionById(id: string): Promise<Section | null> {
    return this.prisma.section.findUnique({ where: { id } });
  }

  verifyAccountOwnership(requestAccountId: number, resourceAccountId: number) {
    if (requestAccountId !== resourceAccountId) {
      throw new ForbiddenException('You do not have access to this resource');
    }
  }

  async reorderSections(accountId: number, data: OrderSectionDto[]) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        for (let i = 0; i < data.length; i++) {
          const sectionInput = data[i];

          const section = await prisma.section.findUnique({
            where: { id: sectionInput.id },
          });
          if (!section)
            throw new NotFoundException(`Section ${sectionInput.id} not found`);
          this.verifyAccountOwnership(accountId, section.accountId);

          if (section.order !== i) {
            await prisma.section.update({
              where: { id: sectionInput.id },
              data: { order: i },
            });
          }

          for (let j = 0; j < sectionInput.items.length; j++) {
            const itemInput = sectionInput.items[j];
            const item = await prisma.item.findUnique({
              where: { id: itemInput.id },
            });
            if (!item)
              throw new NotFoundException(`Item ${itemInput.id} not found`);

            const updates: any = {};
            if (item.sectionId !== sectionInput.id)
              updates.sectionId = sectionInput.id;
            if (item.order !== j) updates.order = j;

            if (Object.keys(updates).length > 0) {
              await prisma.item.update({
                where: { id: itemInput.id },
                data: updates,
              });
            }
          }
        }
      });
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to reorder sections');
    }
  }

  async createSection(
    data: CreateSectionDto,
    accountId: number,
  ): Promise<Section[]> {
    try {
      const lastSection = await this.prisma.section.findFirst({
        where: { accountId },
        orderBy: { order: 'desc' },
      });

      const nextOrder = lastSection ? lastSection.order + 1 : 0;
      await this.prisma.section.create({
        data: {
          ...data,
          accountId,
          order: nextOrder,
        },
      });
      return this.getAllSectionsWithItems(accountId);
    } catch (error) {
      throw new BadRequestException('Failed to create section');
    }
  }

  async updateSection(
    accountId: number,
    id: string,
    data: UpdateSectionDto,
  ): Promise<Section[]> {
    try {
      const section = await this.getSectionById(id);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      await this.prisma.section.update({ where: { id }, data });
      return this.getAllSectionsWithItems(accountId);
    } catch {
      throw new BadRequestException('Failed to update section');
    }
  }

  async deleteSection(accountId: number, id: string): Promise<Section[]> {
    try {
      const section = await this.getSectionById(id);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      await this.prisma.section.delete({ where: { id } });
      return this.getAllSectionsWithItems(accountId);
    } catch {
      throw new BadRequestException('Failed to delete section');
    }
  }

  async getItemById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({ where: { id } });
  }

  async addItemToSection(
    accountId: number,
    data: CreateItemDto,
  ): Promise<Section[]> {
    try {
      const section = await this.getSectionById(data.sectionId);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      const lastItem = await this.prisma.item.findFirst({
        where: { sectionId: data.sectionId },
        orderBy: { order: 'desc' },
      });

      const nextOrder = lastItem ? lastItem.order + 1 : 0;
      await this.prisma.item.create({
        data: {
          ...data,
          order: nextOrder,
        },
      });
      return this.getAllSectionsWithItems(accountId);
    } catch {
      throw new BadRequestException('Failed to add item');
    }
  }

  async updateItem(
    accountId: number,
    id: string,
    data: UpdateItemDto,
  ): Promise<Section[]> {
    try {
      const item = await this.getItemById(id);
      if (!item) throw new NotFoundException('Item not found');

      const section = await this.getSectionById(data.sectionId);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      await this.prisma.item.update({ where: { id }, data });
      return this.getAllSectionsWithItems(accountId);
    } catch {
      throw new BadRequestException('Failed to update item');
    }
  }

  async deleteItem(accountId: number, id: string): Promise<Section[]> {
    try {
      const item = await this.getItemById(id);
      if (!item) throw new NotFoundException('Item not found');

      const section = await this.getSectionById(item.sectionId);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      await this.prisma.item.delete({ where: { id } });
      return this.getAllSectionsWithItems(accountId);
    } catch {
      throw new BadRequestException('Failed to delete item');
    }
  }
}
