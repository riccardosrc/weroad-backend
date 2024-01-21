import {
  Args,
  Float,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ToursService } from './tours.service';
import { TourType } from './type/tour.type';
import { Tour } from './entities/tour.entity';
import { CreateTourInput } from './dto/create-tour.input';
import { PaginatedTours } from './type/paginated-tours.type';

@Resolver(() => TourType)
export class ToursResolver {
  constructor(private readonly toursService: ToursService) {}

  @Mutation(() => TourType)
  @UseGuards(JwtAuthGuard)
  async createTour(@Args('createTourInput') createTourInput: CreateTourInput) {
    const tour = await this.toursService.create(createTourInput);
    return tour;
  }

  @Query(() => PaginatedTours, { name: 'tours' })
  async findAll(
    @Args() paginationArgs: PaginationArgs,
  ): Promise<PaginatedTours> {
    const { tours, count } = await this.toursService.findAll(paginationArgs);
    return new PaginatedTours(tours, count);
  }

  @Query(() => TourType, { name: 'tour' })
  async findOne(@Args('id') tourId: string): Promise<Tour> {
    const tour = await this.toursService.findOne(tourId);
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    return tour;
  }

  @ResolveField(() => Float)
  price(@Parent() tour: Tour) {
    return tour.price / 100;
  }
}
