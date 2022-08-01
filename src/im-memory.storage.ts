import { User } from './user/interfaces/user.interface';
import { Global, Injectable, Module } from '@nestjs/common';
import { Artist } from './artist/interfaces/artist.interface';

import { Favorites } from './favorites/interfaces/favorites.interface';
import { Album } from './album/interfaces/album.interface';
import { Track } from './track/interfaces/track.interface';

export interface Storage {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: Favorites;
}

@Injectable()
export class InMemoryDataBase implements Storage {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: Favorites;

  constructor() {
    this.users = [];
    this.artists = [];
    this.albums = [];
    this.tracks = [];
    this.favorites = {
      artists: [],
      albums: [],
      tracks: [],
    };
  }
}

@Global()
@Module({
  providers: [InMemoryDataBase],
  exports: [InMemoryDataBase],
})
export class InMemoryDataBaseModule {}
