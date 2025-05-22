import { Module } from '@nestjs/common';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
  providers: [SectionService],
  controllers: [SectionController],
  exports: [SectionService],
})
export class SectionModule {}
