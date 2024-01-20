import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OptionalAuth } from 'src/common/decorators/optional-auth.decorator';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { MessageType } from 'src/common/types/message.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { TravelsService } from './travels.service';
import { PaginatedTravels } from './types/paginated-travels.type';
import { TravelMoodType } from './types/travel-mood.type';
import { Travel } from './entities/travel.entity';
import { TravelType } from './types/travel.type';
import { CreateTravelInput } from './dto/create-travel.input';

@Resolver(() => TravelType)
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Mutation(() => TravelType)
  @UseGuards(JwtAuthGuard)
  async createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
  ) {
    const travel = await this.travelsService.createTravel(createTravelInput);
    return travel;
  }

  @Query(() => PaginatedTravels, { name: 'travels' })
  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<PaginatedTravels> {
    // admin user can access all travels
    const isPublicRequest = !user?.isAdmin;
    const { travels, count } = await this.travelsService.findAll(
      paginationArgs,
      isPublicRequest,
    );
    return new PaginatedTravels(travels, count);
  }

  @Mutation(() => MessageType)
  @UseGuards(JwtAuthGuard)
  async deleteTravel(@Args('id', { type: () => String }) travelId: string) {
    const travelToDelete = await this.travelsService.findOne(travelId);
    if (!travelToDelete) {
      throw new NotFoundException(`travel with id ${travelId} not found`);
    }
    await this.travelsService.deleteTravel(travelToDelete);
    return new MessageType('travel deleted successfully');
  }

  @ResolveField(() => TravelMoodType)
  async mood(@Parent() travel: Travel) {
    return this.travelsService.getTravelMood(travel);
  }

  @ResolveField(() => Int)
  async nights(@Parent() travel: Travel) {
    return travel.days - 1;
  }
}
