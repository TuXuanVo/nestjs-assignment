import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { OutputUserDto } from './dto/outputUser.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { QueryParmas } from 'src/helper/class/queryParams';
import { Pagination } from 'src/helper/class/pagination';
import { of } from 'rxjs';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<OutputUserDto[]> {
    const users = await this.userRepository.find();
    const outputUsers: OutputUserDto[] = this.mapper.mapArray(
      users,
      UserEntity,
      OutputUserDto,
    );
    return outputUsers;
  }

  async create(user: CreateUserDto, avatar: string): Promise<OutputUserDto> {
    const userExist = await this.userRepository.findOne({
      where: { username: user.username },
    });

    const userEmailExist = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (userEmailExist) {
      throw new UnprocessableEntityException('Email is already exist');
    }

    if (userExist) {
      throw new UnprocessableEntityException('Username is already exist');
    }

    const hashPassword: string = bcrypt.hashSync(user.password, 10);
    const newUser: CreateUserDto = { ...user, password: hashPassword };
    if (avatar !== '') {
      newUser.avatar = avatar;
    }

    const createdUser = await this.userRepository.save(newUser);

    const outputUser = this.mapper.map(createdUser, UserEntity, OutputUserDto);

    return outputUser;
  }

  async update(username: string, name: string, birthday: Date, avatar: string) {
    const userExist = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!userExist) {
      throw new HttpException('Username not found', 404);
    }

    if (avatar === '') {
      avatar = userExist.avatar;
    }

    const updateUser = await this.userRepository.update(userExist.id, {
      name,
      birthday,
      avatar,
    });

    if (updateUser.affected < 0) {
      throw new HttpException('Can not update user', 404);
    }

    return {
      name,
      birthday,
      avatar,
    };
  }

  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<string> {
    const userExist = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!userExist) {
      throw new UnprocessableEntityException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userExist.password,
    );

    if (!isPasswordMatch) {
      throw new ForbiddenException('Password is not correct');
    }

    const newHashPassword: string = bcrypt.hashSync(newPassword, 10);

    const updatePassword = await this.userRepository.update(userExist.id, {
      password: newHashPassword,
    });
    if (updatePassword.affected < 0) {
      throw new HttpException('Cannot update password', HttpStatus.BAD_REQUEST);
    }
    return 'Update password sucessfully';
  }

  async getPagination(
    queryParam: QueryParmas,
  ): Promise<Pagination<OutputUserDto>> {
    const skipIndex = (queryParam.page - 1) * queryParam.limit;
    const totalRecord: number = await this.userRepository.count();

    const users = await this.userRepository
      .createQueryBuilder()
      .where(
        `(name like '%${queryParam.search || ''}%'  or username like '%${
          queryParam.search || ''
        }%' or email like '%${queryParam.search || ''}%')`,
      )
      .offset(skipIndex)
      .limit(queryParam.limit)
      .getMany();
    const outputUsers = this.mapper.mapArray(users, UserEntity, OutputUserDto);

    return {
      data: outputUsers,
      page: queryParam.page,
      limit: queryParam.limit,
      totalRecord,
    };
  }

  async blockUser(id: number): Promise<String> {
    const userExist = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!userExist) {
      throw new HttpException('User not found', 404);
    }

    const updateUser = await this.userRepository.update(userExist.id, {
      isBlock: true,
    });

    if (updateUser.affected < 0) {
      throw new HttpException('Can not block user', 404);
    }

    return `Block user has id : ${id} success`;
  }

  async unblockUser(id: number): Promise<String> {
    const userExist = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!userExist) {
      throw new HttpException('User not found', 404);
    }

    const updateUser = await this.userRepository.update(userExist.id, {
      isBlock: false,
    });

    if (updateUser.affected < 0) {
      throw new HttpException('Can not unblock user', 404);
    }

    return `Unblock user has id : ${id} successfully`;
  }

  async getUserProfile(username: string): Promise<OutputUserDto> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const outputUser = this.mapper.map(user, UserEntity, OutputUserDto);
    return outputUser;
  }
}
