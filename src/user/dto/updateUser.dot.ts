import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ type: String, default: 'Nguyen Hoa Hoa' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, format: 'date-time', default: '01/01/2001' })
  @IsNotEmpty()
  @IsString()
  birthday: Date;
}
