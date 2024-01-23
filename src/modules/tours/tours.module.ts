import { Module, forwardRef } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { TravelsModule } from '../travels/travels.module';
import { ToursService } from './tours.service';
import { ToursResolver } from './tours.resolver';
import { Tour } from './entities/tour.entity';

@Module({
  imports: [forwardRef(() => TravelsModule), MikroOrmModule.forFeature([Tour])],
  providers: [ToursResolver, ToursService],
  exports: [ToursService],
})
export class ToursModule {}
