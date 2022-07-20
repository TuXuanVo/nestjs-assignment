import { AutoMap } from '@automapper/classes';

export class OutputUserDto {
  @AutoMap()
  name: string;
  @AutoMap()
  username: string;
  @AutoMap()
  email: string;
  @AutoMap()
  avatar: string;
  @AutoMap()
  birthday: Date;
  @AutoMap()
  isBlock: boolean;
  @AutoMap()
  role: string;
}
