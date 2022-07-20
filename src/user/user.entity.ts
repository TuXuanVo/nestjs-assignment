import { AutoMap } from '@automapper/classes';
import { Role } from 'src/helper/enum/Role';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ unique: true })
  username: string;

  @AutoMap()
  @Column({ unique: true })
  email: string;

  @AutoMap()
  @Column({
    default:
      'https://res.cloudinary.com/cake-shop/image/upload/v1647313324/fhrml4yumdl42kk88jll.jpg',
  })
  avatar: string;

  @AutoMap()
  @Column('date')
  birthday: Date;

  @Column()
  password: string;

  @AutoMap()
  @Column({ type: 'boolean', default: false })
  isBlock: boolean;

  @AutoMap()
  @Column({
    type: 'enum',
    default: Role.User,
    enum: Role,
  })
  role: Role;
}
