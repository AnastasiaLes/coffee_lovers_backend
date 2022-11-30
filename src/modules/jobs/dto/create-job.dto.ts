import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnglishLevel } from '@constants/entities';

export default class CreateJobDto {
  @ApiProperty({ example: 'Landing page' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'I need create landing page' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @IsNumber()
  hourly_rate?: number;

  @ApiProperty({ example: 4 })
  @IsOptional()
  @IsNumber()
  available_time?: number;

  @ApiProperty({ example: 4 })
  @IsOptional()
  @IsNumber()
  category?: number;

  @ApiProperty({ example: 'Upper-intermadiate' })
  @IsOptional()
  @IsString()
  english_level?: EnglishLevel;

  @ApiProperty({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  skills?: number[];
}
