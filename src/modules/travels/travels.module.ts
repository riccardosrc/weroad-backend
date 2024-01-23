import { Module, forwardRef } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { TravelsService } from './travels.service';
import { TravelsResolver } from './travels.resolver';
import { Travel } from './entities/travel.entity';
import { TravelMood } from './entities/travel-mood.entity';
import { ToursModule } from '../tours/tours.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Travel, TravelMood]),
    forwardRef(() => ToursModule),
  ],
  providers: [TravelsResolver, TravelsService],
  exports: [TravelsService],
})
export class TravelsModule {}
