import { Body, Controller, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @ApiOkResponse({ description: 'sigin successfully.' })
  @ApiNotFoundResponse({ description: 'Username not found.' })
  signin(@Body() auth: AuthDto) {
    return this.authService.signin(auth);
  }
}
