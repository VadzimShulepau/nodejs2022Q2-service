import { AlbumEntity } from './entities/album.entity';
import { InMemoryDataBase } from './../im-memory.storage';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';
// import { v4 as uuid } from 'uuid';
@Injectable()
export class AlbumService {
  constructor(
    private db: InMemoryDataBase,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async create(
    createAlbumDto: CreateAlbumDto,
  ): Promise<AlbumEntity | undefined> {
    const { name, year, artistId } = createAlbumDto;
    const album = new AlbumEntity(name, year, artistId);
    // const album = {
    //   id: uuid(),
    //   name,
    //   year,
    //   artistId,
    // };

    this.db.albums.push(album);
    return album;
  }

  async findAll(): Promise<AlbumEntity[]> {
    return this.db.albums;
  }

  async findOne(id: string): Promise<AlbumEntity | undefined> {
    const album = this.db.albums.find((album) => album.id === id);
    return album;
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity | undefined> {
    const album = await this.findOne(id);

    if (!album) throw new NotFoundException('album not found');
    Object.assign(album, { ...updateAlbumDto });
    return album;
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);
    if (!album) throw new NotFoundException('artist not found');

    this.db.albums = this.db.albums.filter(
      (album: AlbumEntity) => album.id !== id,
    );

    const tracks = await this.trackService.findAll();
    tracks.filter((track) => track.albumId === id);

    tracks.map(async (track) => {
      const { id, name, artistId, duration } = track;
      return await this.trackService.update(id, {
        name,
        artistId,
        albumId: null,
        duration,
      });
    });

    this.favoritesService.deleteFavsAlbum(id);
  }
}
