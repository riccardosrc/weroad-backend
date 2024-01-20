import { ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/common/types/paginated.type';
import { TravelType } from './travel.type';

@ObjectType()
export class PaginatedTravels extends Paginated(TravelType) {}
