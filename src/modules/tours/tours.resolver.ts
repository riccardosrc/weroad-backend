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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ToursService } from './tours.service';
import { TourType } from './type/tour.type';
import { Tour } from './entities/tour.entity';
import { CreateTourInput } from './dto/create-tour.input';
import { PaginatedTours } from './type/paginated-tours.type';
import { UpdateTourInput } from './dto/update-tour.input';
import { AdminGuard } from '../auth/guards/admin.guard';
import { TourListArgs } from './dto/tour-list.args';

@Resolver(() => TourType)
export class ToursResolver {
  constructor(private readonly toursService: ToursService) {}

  @Mutation(() => TourType)
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  async createTour(@Args('createTourInput') createTourInput: CreateTourInput) {
    const tour = await this.toursService.create(createTourInput);
    return tour;
  }

  @Mutation(() => TourType)
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  async updateTour(
    @Args('id') id: string,
    @Args('updateTourInput') updateTourInput: UpdateTourInput,
  ) {
    const tour = await this.toursService.update(id, updateTourInput);
    return tour;
  }

  @Query(() => PaginatedTours, { name: 'tours' })
  async findAll(@Args() tourListArgs: TourListArgs): Promise<PaginatedTours> {
    const { tours, count } = await this.toursService.findAll(tourListArgs);
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
