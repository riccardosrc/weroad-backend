import { Paginated } from 'src/common/types/paginated.type';
import { UserType } from './user.type';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedUsers extends Paginated(UserType) {}
