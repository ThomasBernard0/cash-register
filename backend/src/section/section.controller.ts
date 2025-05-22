import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SectionService } from './section.service';

@Controller('api/section')
@UseGuards(JwtAuthGuard)
export class SectionController {
  constructor(private sectionService: SectionService) {}
}
