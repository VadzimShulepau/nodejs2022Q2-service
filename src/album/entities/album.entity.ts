import { Album } from './../interfaces/album.interface';
import { v4 as uuid } from 'uuid';

export class AlbumEntity implements Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(name: string, year: number, artistId: string | null) {
    this.id = uuid();
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}
