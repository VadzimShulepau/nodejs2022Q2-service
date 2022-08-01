import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  Put,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  // @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  // @HttpCode(200)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  // @HttpCode(200)
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Put(':id')
  // @HttpCode(200)
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    return await this.userService.remove(id);
  }
}
