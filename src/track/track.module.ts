import { Module, forwardRef } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { InMemoryDataBaseModule } from 'src/im-memory.storage';

@Module({
  imports: [
    InMemoryDataBaseModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
