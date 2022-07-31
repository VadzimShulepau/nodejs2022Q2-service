import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { InMemoryDataBaseModule } from '../im-memory.storage';

@Module({
  imports: [InMemoryDataBaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
