import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Item, Section } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

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
      return this.prisma.section.create({
        data: { ...data, accountId },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create section');
    }
  }

  async updateSection(id: string, data: UpdateSectionDto): Promise<Section> {
    let existing: Section | null;
    try {
      existing = await this.prisma.section.findUnique({ where: { id } });
    } catch {
      throw new BadRequestException('Error accessing database');
    }
    if (!existing) throw new NotFoundException('Section not found');

    try {
      return this.prisma.section.update({ where: { id }, data });
    } catch {
      throw new BadRequestException('Failed to update section');
    }
  }

  async deleteSection(id: string): Promise<Section> {
    let existing: Section | null;
    try {
      existing = await this.prisma.section.findUnique({ where: { id } });
    } catch {
      throw new BadRequestException('Error accessing database');
    }
    if (!existing) throw new NotFoundException('Section not found');

    try {
      return this.prisma.section.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Failed to delete section');
    }
  }

  async getItemById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({ where: { id } });
  }

  async addItemToSection(data: CreateItemDto): Promise<Item> {
    let section: Section | null;
    try {
      section = await this.prisma.section.findUnique({
        where: { id: data.sectionId },
      });
    } catch {
      throw new BadRequestException('Error accessing database');
    }
    if (!section) throw new NotFoundException('Section not found');

    try {
      return this.prisma.item.create({ data });
    } catch {
      throw new BadRequestException('Failed to add item');
    }
  }

  async updateItem(id: string, data: UpdateItemDto): Promise<Item> {
    let existing: Item | null;
    try {
      existing = await this.prisma.item.findUnique({ where: { id } });
    } catch {
      throw new BadRequestException('Error accessing database');
    }
    if (!existing) throw new NotFoundException('Item not found');

    try {
      return this.prisma.item.update({ where: { id }, data });
    } catch {
      throw new BadRequestException('Failed to update item');
    }
  }

  async deleteItem(id: string): Promise<Item> {
    let existing: Item | null;
    try {
      existing = await this.prisma.item.findUnique({ where: { id } });
    } catch {
      throw new BadRequestException('Error accessing database');
    }
    if (!existing) throw new NotFoundException('Item not found');

    try {
      return this.prisma.item.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Failed to delete item');
    }
  }
}
