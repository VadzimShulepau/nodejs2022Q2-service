import { User } from '../interfaces/user.interface';
import { v4 as uuid } from 'uuid';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(login: string, password: string) {
    this.id = uuid();
    this.login = login;
    this.password = password;
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}
