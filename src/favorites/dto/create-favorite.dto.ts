import { IsArray } from 'class-validator';

export class CreateFavoriteDto {
  @IsArray()
  artists: string[];

  @IsArray()
  albums: string[];

  @IsArray()
  tracks: string[];
}
