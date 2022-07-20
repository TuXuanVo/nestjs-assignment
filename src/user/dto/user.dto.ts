import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/helper/enum/Role';

export class UserDto {
  @AutoMap()
  @ApiProperty({ type: String, default: 'Nguyen Ngoc' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @AutoMap()
  @ApiProperty({ type: String, default: 'ngocvip' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 8)
  @IsAlphanumeric()
  username: string;

  @AutoMap()
  @ApiProperty({ type: String, default: 'ngoc@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @AutoMap()
  @ApiProperty({
    type: String,
    default:
      'https://res.cloudinary.com/cake-shop/image/upload/v1647313324/fhrml4yumdl42kk88jll.jpg',
  })
  @IsOptional()
  avatar: string;

  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time', default: '01/01/2001' })
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({ type: String, default: '123456789' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: Boolean, default: 'false' })
  isBlock: boolean;

  @ApiProperty({ type: String, default: 'user' })
  role: Role;
}
