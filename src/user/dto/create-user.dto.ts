import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  // @ApiProperty() //for nestjs swagger
  @IsString()
  @IsNotEmpty()
  login: string;

  // @ApiProperty() //for nestjs swagger
  @IsString()
  @IsNotEmpty()
  password: string;
}
