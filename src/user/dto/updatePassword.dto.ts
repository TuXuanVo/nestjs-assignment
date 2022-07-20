import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ type: String, default: '123456789' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ type: String, default: '987654321' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
