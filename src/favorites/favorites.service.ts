import { ArtistService } from './../artist/artist.service';
import { InMemoryDataBase } from 'src/im-memory.storage';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponseEntity } from './entities/favorite-response.entity';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { EType } from './enums/type.enum';

@Injectable()
export class FavoritesService {
  constructor(
    private db: InMemoryDataBase,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  private service = {
    artists: async (id: string) => {
      return await this.artistService.findOne(id);
    },
    albums: async (id: string) => {
      return await this.albumService.findOne(id);
    },
    tracks: async (id: string) => {
      return await this.trackService.findOne(id);
    },
  };

  private async isFavs(id: string, item: string): Promise<string> {
    const fav = await this.db.favorites[item].find(
      (itemId: string) => itemId === id,
    );
    return fav;
  }

  private async addItem(id: string, item: string) {
    const isExist = await this.isFavs(id, item);

    const isService = await this.service[item](id);

    if (!isExist && isService) {
      this.db.favorites[item].push(id);
    } else {
      throw new UnprocessableEntityException();
    }
  }

  private delItem(id: string, item: string) {
    const isExist = this.isFavs(id, item);
    if (isExist) {
      this.db.favorites[item] = this.db.favorites[item].filter(
        (itemId: string) => itemId !== id,
      );
      return this.db.favorites[item];
    } else {
      throw new NotFoundException();
    }
  }

  private async getAll(item: string) {
    return await Promise.all(
      this.db.favorites[item].map(
        async (id: string) => await this.service[item](id),
      ),
    );
  }

  async addFavsArtist(id: string): Promise<void> {
    return await this.addItem(id, EType.artists);
  }

  async addFavsAlbum(id: string): Promise<void> {
    return await this.addItem(id, EType.albums);
  }

  async addFavsTrack(id: string): Promise<void> {
    return await this.addItem(id, EType.tracks);
  }

  async findAll(): Promise<FavoritesResponseEntity> {
    const favs = {
      artists: await this.getAll(EType.artists),
      albums: await this.getAll(EType.albums),
      tracks: await this.getAll(EType.tracks),
    };
    return favs;
  }

  async deleteFavsArtist(id: string): Promise<void> {
    this.delItem(id, EType.artists);
  }

  async deleteFavsAlbum(id: string): Promise<void> {
    this.delItem(id, EType.albums);
  }

  async deleteFavsTrack(id: string): Promise<void> {
    this.delItem(id, EType.tracks);
  }
}
