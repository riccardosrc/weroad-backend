import { ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/shared/types/paginated.type';
import { TravelType } from './travel.type';

@ObjectType()
export class PaginatedTravels extends Paginated(TravelType) {}
