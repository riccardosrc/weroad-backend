import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './types/user.type';
import { CreateUserInput } from './dto/create-user.input';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { PaginatedUsers } from './types/paginated-users.type';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserType)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => PaginatedUsers, { name: 'users' })
  async findAll(@Args() paginationArgs: PaginationArgs) {
    const { users, count } = await this.usersService.findAll(paginationArgs);
    return { items: users, totalCount: count, hasNextPage: false };
  }

  @Query(() => UserType, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }
}
