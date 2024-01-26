import {
  Args,
  Float,
  GraphQLISODateTime,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { OptionalAuth } from 'src/shared/decorators/optional-auth.decorator';
import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { MessageType } from 'src/shared/types/message.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { TourType } from '../tours/type/tour.type';
import { TravelsService } from './travels.service';
import { PaginatedTravels } from './types/paginated-travels.type';
import { TravelMoodType } from './types/travel-mood.type';
import { Travel } from './entities/travel.entity';
import { TravelType } from './types/travel.type';
import { CreateTravelInput } from './dto/create-travel.input';
import { ToursService } from '../tours/tours.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Resolver(() => TravelType)
export class TravelsResolver {
  constructor(
    private readonly travelsService: TravelsService,
    private readonly toursService: ToursService,
  ) {}

  @Mutation(() => TravelType)
  @UseGuards(AdminGuard)
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

  @Query(() => TravelType, { name: 'travel' })
  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  async findOne(
    @CurrentUser() user: User,
    @Args('id') id: string,
  ): Promise<Travel> {
    // admin user can access all travels
    const isPublicRequest = !user?.isAdmin;
    const travel = await this.travelsService.findOne(id);
    if (!travel) {
      throw new NotFoundException('travel not found');
    }
    if (isPublicRequest && !travel.isPublic) {
      throw new ForbiddenException('private travel');
    }
    return travel;
  }

  @Query(() => TravelType, { name: 'travelBySlug' })
  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  async findOneBySlug(
    @CurrentUser() user: User,
    @Args('slug') slug: string,
  ): Promise<Travel> {
    // admin user can access all travels
    const isPublicRequest = !user?.isAdmin;
    const travel = await this.travelsService.findOneBySlug(slug);
    if (!travel) {
      throw new NotFoundException('travel not found');
    }
    if (isPublicRequest && !travel.isPublic) {
      throw new ForbiddenException('private travel');
    }
    return travel;
  }

  @Mutation(() => MessageType)
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
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

  @ResolveField(() => [TourType])
  async tours(@Parent() travel: Travel) {
    return this.travelsService.getTravelTours(travel);
  }

  @ResolveField(() => Float)
  async cheapestTour(@Parent() travel: Travel) {
    const price = await this.toursService.findCheapestPriceByTravel(travel);
    if (!price) {
      return undefined;
    }
    return price / 100;
  }

  @ResolveField(() => GraphQLISODateTime)
  async firstAvailableDate(@Parent() travel: Travel) {
    const firstDate =
      await this.toursService.findFirstAvailableDateByTravel(travel);
    return firstDate;
  }
}
