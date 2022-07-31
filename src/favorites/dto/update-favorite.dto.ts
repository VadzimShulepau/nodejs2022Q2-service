import { IsArray } from 'class-validator';

export class UpdateFavoriteDto {
  @IsArray()
  artists: string[];

  @IsArray()
  albums: string[];

  @IsArray()
  tracks: string[];
}
