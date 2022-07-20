import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  Query,
  Param,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CustomFileName } from 'src/helper/class/customFileName';
import { Pagination } from 'src/helper/class/pagination';
import { QueryParmas } from 'src/helper/class/queryParams';
import { Roles } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/Role';
import { CreateUserDto } from './dto/createUser.dto';
import { OutputUserDto } from './dto/outputUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateUserDto } from './dto/updateUser.dot';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkResponse({ description: 'Users retrieved successfully.' })
  findAll(): Promise<OutputUserDto[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-token')
  @ApiOkResponse({ description: 'Get profile successfully' })
  getProfile(@Request() req) {
    const username = req.user.username;
    return this.userService.getUserProfile(username);
  }

  @Post()
  @ApiOkResponse({ description: 'Create user successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Username already exists.' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: CustomFileName.destinationPath,
        filename: CustomFileName.fileName,
      }),
    }),
  )
  create(
    @Body() user: CreateUserDto,
    @UploadedFile() image,
  ): Promise<OutputUserDto> {
    let avatar = '';
    if (image) {
      avatar = `http://localhost:3000/uploads/${image.filename}`;
    }

    return this.userService.create(user, avatar);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth('JWT-token')
  @ApiOkResponse({ description: 'Update user successfully' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: CustomFileName.destinationPath,
        filename: CustomFileName.fileName,
      }),
    }),
  )
  update(
    @Body() updateUser: UpdateUserDto,
    @Request() req,
    @UploadedFile() image,
  ) {
    const username = req.user.username;
    let avatar = '';
    if (image) {
      avatar = `http://localhost:3000/uploads/${image.filename}`;
    }

    console.log(updateUser);
    return this.userService.update(
      username,
      updateUser.name,
      updateUser.birthday,
      avatar,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ApiBearerAuth('JWT-token')
  @ApiOkResponse({ description: 'Update password successfully' })
  updatePassword(
    @Body() updatePassword: UpdatePasswordDto,
    @Request() req,
  ): Promise<string> {
    const username = req.user.username;
    return this.userService.changePassword(
      username,
      updatePassword.oldPassword,
      updatePassword.newPassword,
    );
  }

  @Get('/pagination')
  @ApiOkResponse({ description: 'Get pagination successfully' })
  getPagination(
    @Query() queryParams: QueryParmas,
  ): Promise<Pagination<OutputUserDto>> {
    console.log(queryParams);
    return this.userService.getPagination(queryParams);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-token')
  @Post(':id/block')
  blockUse(@Param('id') id: number): Promise<String> {
    return this.userService.blockUser(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-token')
  @Post(':id/unblock')
  unblockUse(@Param('id') id: number): Promise<String> {
    return this.userService.unblockUser(id);
  }

  @ApiOkResponse({ description: 'Get avatar successfully' })
  @Get('profile/:avatar')
  getAvatar(@Param('avatar') avatar: string, @Res() res): Observable<any> {
    return of(res.sendFile(join(process.cwd(), 'uploads/' + avatar)));
  }
}
