import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string;

  @IsString()
  @IsOptional()
  albumId: string;

  @IsNumber()
  duration: number;
  static albumId: any;
}
