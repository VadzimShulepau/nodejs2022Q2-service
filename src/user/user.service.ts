import { UserEntity } from './entities/user.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InMemoryDataBase } from 'src/im-memory.storage';

@Injectable()
export class UserService {
  constructor(private db: InMemoryDataBase) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { login, password } = createUserDto;

    const newUser = new UserEntity(login, password);
    this.db.users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.db.users;
  }

  async findOne(id: string): Promise<UserEntity | undefined> {
    const user = this.db.users.find((user: UserEntity) => user.id === id);
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdatePasswordDto,
  ): Promise<UserEntity | undefined> {
    const { oldPassword, newPassword } = updateUserDto;
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    if (user.password !== oldPassword)
      throw new ForbiddenException('password is wrong');

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  async remove(id: string): Promise<UserEntity | undefined> {
    const user = await this.findOne(id);
    if (user) {
      this.db.users = this.db.users.filter((u: UserEntity) => u.id !== id);
      return user;
    } else throw new NotFoundException('user not found');
  }
}
