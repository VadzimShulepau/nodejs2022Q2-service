import { Favorites } from './../interfaces/favorites.interface';

export class FavoritesEntity implements Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];

  constructor(artists: string[], albums: string[], tracks: string[]) {
    this.artists = artists;
    this.albums = albums;
    this.tracks = tracks;
  }
}
