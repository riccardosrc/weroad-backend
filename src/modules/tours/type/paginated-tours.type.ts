import { ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/shared/types/paginated.type';
import { TourType } from './tour.type';

@ObjectType()
export class PaginatedTours extends Paginated(TourType) {}
