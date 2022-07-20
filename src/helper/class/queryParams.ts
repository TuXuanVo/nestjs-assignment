import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryParmas {
  @ApiProperty({ type: Number, default: 1 })
  @IsInt()
  @Type(() => Number)
  page: number;

  @ApiProperty({ type: Number, default: 5 })
  @IsInt()
  @Type(() => Number)
  limit: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  search: String;
}
