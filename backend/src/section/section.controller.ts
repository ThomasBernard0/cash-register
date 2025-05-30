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
import { Section } from '@prisma/client';
import {
  CreateItemDto,
  OrderSectionDto,
  UpdateItemDto,
  UpdateSectionDto,
} from './section.dto';

@Controller('api/sections')
@UseGuards(JwtAuthGuard)
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  async getAllSections(@Req() req) {
    const accountId: number = req.user.sub;
    return this.sectionService.getAllSectionsWithItems(accountId);
  }

  @Patch('reorder')
  updateOrder(@Body() dto: OrderSectionDto[], @Req() req) {
    const accountId = req.user.sub;
    return this.sectionService.reorderSections(accountId, dto);
  }

  @Post()
  async createSection(@Req() req): Promise<Section[]> {
    const accountId: number = req.user.sub;
    return this.sectionService.createSection(accountId);
  }

  @Patch(':id')
  async updateSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateSectionDto,
    @Req() req,
  ): Promise<Section[]> {
    const accountId: number = req.user.sub;
    return this.sectionService.updateSection(accountId, id, data);
  }

  @Delete(':id')
  async deleteSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ): Promise<Section[]> {
    const accountId = req.user.sub;
    return this.sectionService.deleteSection(accountId, id);
  }

  @Post('/items')
  async createItem(
    @Body() data: CreateItemDto,
    @Req() req,
  ): Promise<Section[]> {
    const accountId = req.user.sub;
    return this.sectionService.addItemToSection(accountId, data);
  }

  @Patch('items/:itemId')
  async updateItem(
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body() data: UpdateItemDto,
    @Req() req,
  ): Promise<Section[]> {
    const accountId = req.user.sub;
    return this.sectionService.updateItem(accountId, itemId, data);
  }

  @Delete('items/:itemId')
  async deleteItem(
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Req() req,
  ): Promise<Section[]> {
    const accountId = req.user.sub;
    return this.sectionService.deleteItem(accountId, itemId);
  }
}
