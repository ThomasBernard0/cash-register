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

export class OrderSectionDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}

export class OrderItemDto {
  @IsString()
  id!: string;
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
