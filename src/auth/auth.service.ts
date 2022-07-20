import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signin(auth: AuthDto) {
    const user = await this.userRepository.findOne({
      where: { username: auth.username },
    });

    if (!user) {
      throw new NotFoundException('Username not found');
    }

    const isPasswordMatch = await bcrypt.compare(auth.password, user.password);

    if (!isPasswordMatch) {
      throw new ForbiddenException('Password is not correct');
    }

    if (user.isBlock) {
      throw new HttpException('Your account is blocked', HttpStatus.FORBIDDEN);
    }

    const { id, password, ...outputUser } = user;
    const jwtToken = await this.signToken(auth.username);
    return {
      ...outputUser,
      jwtToken,
    };
  }

  signToken(username: string): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    const payload = {
      username,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });
  }
}
