import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SectionService } from './section.service';

@Controller('api/sections')
@UseGuards(JwtAuthGuard)
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Post()
  createSection(@Body() data: SectionData) {
    return this.sectionService.createSection(data);
  }

  @Put(':id')
  updateSection(@Param('id') id: string, @Body() data: Partial<SectionData>) {
    return this.sectionService.updateSection(id, data);
  }

  @Delete(':id')
  deleteSection(@Param('id') id: string) {
    return this.sectionService.deleteSection(id);
  }

  @Post('items')
  addItem(@Body() data: ItemData) {
    return this.sectionService.addItemToSection(data);
  }

  @Put('items/:id')
  updateItem(@Param('id') id: string, @Body() data: Partial<ItemData>) {
    return this.sectionService.updateItem(id, data);
  }

  @Delete('items/:id')
  deleteItem(@Param('id') id: string) {
    return this.sectionService.deleteItem(id);
  }
}
