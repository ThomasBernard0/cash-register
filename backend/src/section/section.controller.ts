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

@Controller('api/sections')
@UseGuards(JwtAuthGuard)
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  async getAllSections(@Req() req) {
    const accountId: number = req.user.accountId;
    return this.sectionService.getAllSectionsWithItems(accountId);
  }

  @Post()
  async createSection(
    @Body() data: CreateSectionDto,
    @Req() req,
  ): Promise<Section> {
    const accountId: number = req.user.accountId;
    return this.sectionService.createSection(data, accountId);
  }

  @Patch(':id')
  async updateSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateSectionDto,
    @Req() req,
  ): Promise<Section> {
    const accountId: number = req.user.accountId;
    return this.sectionService.updateSection(accountId, id, data);
  }

  @Delete(':id')
  async deleteSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ): Promise<{ message: string }> {
    const accountId = req.user.accountId;
    await this.sectionService.deleteSection(accountId, id);
    return { message: 'Section deleted' };
  }

  @Post('/items')
  async createItem(@Body() data: CreateItemDto, @Req() req): Promise<Item> {
    const accountId = req.user.accountId;
    return this.sectionService.addItemToSection(accountId, data);
  }

  @Patch('items/:itemId')
  async updateItem(
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body() data: UpdateItemDto,
    @Req() req,
  ): Promise<Item> {
    const accountId = req.user.accountId;
    return this.sectionService.updateItem(accountId, itemId, data);
  }

  @Delete('items/:itemId')
  async deleteItem(
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Req() req,
  ): Promise<{ message: string }> {
    const accountId = req.user.accountId;
    await this.sectionService.deleteItem(accountId, itemId);
    return { message: 'Item deleted' };
  }
}
