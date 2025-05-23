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
  SectionOrderEntry,
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

  async createSection(
    data: CreateSectionDto,
    accountId: number,
  ): Promise<Section> {
    try {
      const lastSection = await this.prisma.section.findFirst({
        where: { accountId },
        orderBy: { order: 'desc' },
      });

      const nextOrder = lastSection ? lastSection.order + 1 : 0;
      return await this.prisma.section.create({
        data: {
          ...data,
          accountId,
          order: nextOrder,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create section');
    }
  }

  async updateSection(
    accountId: number,
    id: string,
    data: UpdateSectionDto,
  ): Promise<Section> {
    try {
      const section = await this.getSectionById(id);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      return this.prisma.section.update({ where: { id }, data });
    } catch {
      throw new BadRequestException('Failed to update section');
    }
  }

  async deleteSection(accountId: number, id: string): Promise<Section> {
    try {
      const section = await this.getSectionById(id);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      return this.prisma.section.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Failed to delete section');
    }
  }

  async reorderSections(accountId: number, ordered: SectionOrderEntry[]) {
    try {
      const verificationPromises = ordered.map(async (entry) => {
        const section = await this.getSectionById(entry.id);
        if (!section)
          throw new NotFoundException(`Section ${entry.id} not found`);
        this.verifyAccountOwnership(accountId, section.accountId);
      });
      await Promise.all(verificationPromises);

      const updatePromises = ordered.map((entry) =>
        this.prisma.section.update({
          where: { id: entry.id },
          data: { order: entry.order },
        }),
      );
      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to reorder sections');
    }
  }

  async getItemById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({ where: { id } });
  }

  async addItemToSection(
    accountId: number,
    data: CreateItemDto,
  ): Promise<Item> {
    try {
      const section = await this.getSectionById(data.sectionId);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      const lastItem = await this.prisma.item.findFirst({
        where: { sectionId: data.sectionId },
        orderBy: { order: 'desc' },
      });

      const nextOrder = lastItem ? lastItem.order + 1 : 0;
      return this.prisma.item.create({
        data: {
          ...data,
          order: nextOrder,
        },
      });
    } catch {
      throw new BadRequestException('Failed to add item');
    }
  }

  async updateItem(
    accountId: number,
    id: string,
    data: UpdateItemDto,
  ): Promise<Item> {
    try {
      const item = await this.getItemById(id);
      if (!item) throw new NotFoundException('Item not found');

      const section = await this.getSectionById(data.sectionId);
      if (!section) throw new NotFoundException('Section not found');
      this.verifyAccountOwnership(accountId, section.accountId);

      return this.prisma.item.update({ where: { id }, data });
    } catch {
      throw new BadRequestException('Failed to update item');
    }
  }

  async deleteItem(accountId: number, id: string): Promise<Item> {
    const item = await this.getItemById(id);
    if (!item) throw new NotFoundException('Item not found');

    const section = await this.getSectionById(item.sectionId);
    if (!section) throw new NotFoundException('Section not found');
    this.verifyAccountOwnership(accountId, section.accountId);

    try {
      return this.prisma.item.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Failed to delete item');
    }
  }
}
