// import { Favorites } from './../favorites/interfaces/favorites.interface';
import { TrackEntity } from './entities/track.entity';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InMemoryDataBase } from 'src/im-memory.storage';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoritesService } from 'src/favorites/favorites.service';
// import { v4 as uuid } from 'uuid';

@Injectable()
export class TrackService {
  constructor(
    private db: InMemoryDataBase,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async create(
    createTrackDto: CreateTrackDto,
  ): Promise<TrackEntity | undefined> {
    const { name, artistId, albumId, duration } = createTrackDto;
    const track = new TrackEntity(name, artistId, albumId, duration);

    this.db.tracks.push(track);
    return track;
  }

  async findAll(): Promise<TrackEntity[]> {
    return this.db.tracks;
  }

  async findOne(id: string): Promise<TrackEntity | undefined> {
    const track = this.db.tracks.find((track) => track.id === id);
    return track;
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity | undefined> {
    const track = await this.findOne(id);
    const { name, artistId, albumId, duration } = updateTrackDto;
    if (!track) throw new NotFoundException('user not found');
    Object.assign(track, { name, artistId, albumId, duration });
    return track;
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id);
    if (!track) throw new NotFoundException('track not found');

    this.db.tracks = this.db.tracks.filter(
      (track: TrackEntity) => track.id !== id,
    );

    this.favoritesService.deleteFavsTrack(id);
  }
}
