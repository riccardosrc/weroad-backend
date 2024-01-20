import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { UsersService } from './users.service';
import { UserType } from './types/user.type';
import { CreateUserInput } from './dto/create-user.input';
import { PaginatedUsers } from './types/paginated-users.type';
import { User } from './entities/user.entity';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserType)
  @UseGuards(JwtAuthGuard)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => PaginatedUsers, { name: 'users' })
  @UseGuards(JwtAuthGuard)
  async findAll(@Args() paginationArgs: PaginationArgs) {
    const { users, count } = await this.usersService.findAll(paginationArgs);
    return { items: users, totalCount: count, hasNextPage: false };
  }

  @Query(() => UserType, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField()
  async roles(@Parent() user: User) {
    return this.usersService.getUserRoles(user);
  }
}
