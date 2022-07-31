import { Artist } from './../interfaces/artist.interface';
import { v4 as uuid } from 'uuid';

export class ArtistEntity implements Artist {
  id: string;
  name: string;
  grammy: boolean;

  constructor(name: string, grammy: boolean) {
    this.id = uuid();
    this.name = name;
    this.grammy = grammy;
  }
}
