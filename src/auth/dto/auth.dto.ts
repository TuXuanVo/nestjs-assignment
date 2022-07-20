import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({ type: String, default: 'ngocvip' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ type: String, default: '123456789' })
  @IsNotEmpty()
  password: string;
}
