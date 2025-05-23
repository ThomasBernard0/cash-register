import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSectionDto {
  @IsString()
  title: string;

  @IsString()
  color: string;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateItemDto {
  @IsString()
  label: string;

  @IsInt()
  @Min(0)
  priceInCent: number;

  @IsString()
  sectionId: string;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceInCent?: number;

  @IsOptional()
  @IsString()
  sectionId?: string;
}

export class SectionOrderEntry {
  @IsUUID()
  id: string;

  @IsInt()
  @Min(0)
  order: number;
}

export class UpdateSectionOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionOrderEntry)
  order: SectionOrderEntry[];
}
