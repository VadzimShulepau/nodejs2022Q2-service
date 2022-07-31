import { ArtistEntity } from './entities/artist.entity';
import { InMemoryDataBase } from './../im-memory.storage';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
// import { v4 as uuid } from 'uuid';
@Injectable()
export class ArtistService {
  constructor(
    private db: InMemoryDataBase,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async create(
    createArtistDto: CreateArtistDto,
  ): Promise<ArtistEntity | undefined> {
    const { name, grammy } = createArtistDto;
    const artist = new ArtistEntity(name, grammy);

    this.db.artists.push(artist);
    return artist;
  }

  async findAll(): Promise<ArtistEntity[]> {
    return this.db.artists;
  }

  async findOne(id: string): Promise<ArtistEntity | undefined> {
    const artist = this.db.artists.find((artist) => artist.id === id);
    return artist;
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity | undefined> {
    const artist = await this.findOne(id);
    if (!artist) throw new NotFoundException('artist not found');
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  async remove(id: string): Promise<void> {
    const artist = await this.findOne(id);

    if (!artist) throw new NotFoundException('artist not found');

    this.db.artists = this.db.artists.filter((artist) => artist.id !== id);

    const albums = await this.albumService.findAll();
    albums.filter((album) => album.artistId === id);

    const tracks = await this.trackService.findAll();
    tracks.filter((track) => track.artistId === id);

    albums.map(async (album) => {
      const { id, name, year } = album;
      return await this.albumService.update(id, { name, year, artistId: null });
    });

    tracks.map(async (track) => {
      const { id, name, albumId, duration } = track;
      return await this.trackService.update(id, {
        name,
        artistId: null,
        albumId,
        duration,
      });
    });

    await this.favoritesService.deleteFavsArtist(id);
  }
}
