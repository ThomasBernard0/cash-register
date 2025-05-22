import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SectionService } from './section.service';
import { Section, Item } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  async createSection(
    @Body() data: CreateSectionDto,
    @Req() req,
  ): Promise<Section> {
    const accountId = req.user.accountId;
    return this.sectionService.createSection(data, accountId);
  }

  @Patch(':id')
  async updateSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateSectionDto,
    @Req() req,
  ): Promise<Section> {
    const accountId = req.user.accountId;
    const section = await this.sectionService.getSectionById(id);
    this.sectionService.verifyAccountOwnership(accountId, section.accountId);
    return this.sectionService.updateSection(id, data);
  }

  @Delete(':id')
  async deleteSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ): Promise<{ message: string }> {
    const accountId = req.user.accountId;
    const section = await this.sectionService.getSectionById(id);
    this.sectionService.verifyAccountOwnership(accountId, section.accountId);
    await this.sectionService.deleteSection(id);
    return { message: 'Section deleted' };
  }

  @Post('/items')
  async createItem(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @Body() data: CreateItemDto,
    @Req() req,
  ): Promise<Item> {
    const accountId = req.user.accountId;
    const section = await this.sectionService.getSectionById(sectionId);
    this.sectionService.verifyAccountOwnership(accountId, section.accountId);
    return this.sectionService.addItemToSection(data);
  }

  @Patch('items/:itemId')
  async updateItem(
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body() data: UpdateItemDto,
    @Req() req,
  ): Promise<Item> {
    const accountId = req.user.accountId;
    const section = await this.sectionService.getSectionById(data.sectionId);
    this.sectionService.verifyAccountOwnership(accountId, section.accountId);
    return this.sectionService.updateItem(itemId, data);
  }

  @Delete('items/:itemId')
  async deleteItem(
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Req() req,
  ): Promise<{ message: string }> {
    const accountId = req.user.accountId;
    const item = await this.sectionService.getItemById(itemId);
    const section = await this.sectionService.getSectionById(item.sectionId);
    this.sectionService.verifyAccountOwnership(accountId, section.accountId);
    await this.sectionService.deleteItem(itemId);
    return { message: 'Item deleted' };
  }
}
