import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  EntityManager,
  FilterQuery,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';

import { Utils } from 'src/shared/utils';
import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { TravelsService } from '../travels/travels.service';
import { CreateTourInput } from './dto/create-tour.input';
import { Tour } from './entities/tour.entity';
import { Travel } from '../travels/entities/travel.entity';

@Injectable()
export class ToursService {
  constructor(
    private em: EntityManager,
    private travelsService: TravelsService,
  ) {}

  /**
   * create a new tour associated with a travel
   * @param createTourInput tour data
   * @returns created tour
   */
  async create(createTourInput: CreateTourInput) {
    const { travelId, ...tourData } = createTourInput;
    try {
      const travel = await this.travelsService.findOne(travelId);
      if (!travel) {
        throw new BadRequestException('Invalid travel');
      }
      const endDate = Utils.addDaysToDate(tourData.startDate, travel.days);
      const tour = this.em.create(Tour, { ...tourData, endDate, travel });
      await this.em.persistAndFlush(tour);
      return tour;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException('tour name already in use');
      }
      throw error;
    }
  }

  /**
   * get all tours in a paginated way.
   * @param pagination pagination options
   * @returns list of tours
   */
  async findAll({ offset, limit }: PaginationArgs) {
    const conditions: FilterQuery<Tour> = {};
    const [tours, count] = await this.em.findAndCount(Tour, conditions, {
      populate: ['travel'],
      offset,
      limit,
    });
    return { tours, count };
  }

  /**
   * find tour with provided id
   * @param id tour id
   * @returns found tour
   */
  async findOne(id: string) {
    const tour = await this.em.findOne(Tour, { id }, { populate: ['travel'] });
    return tour;
  }

  /**
   * Find cheapest price tour for the given travel
   * @param travel travel target
   * @returns cheapest price
   */
  async findCheapestPriceByTravel(travel: Travel) {
    const cheapest = await this.em.findOne(
      Tour,
      { travel: { id: travel.id } },
      { populate: ['travel'], orderBy: { price: 'ASC' } },
    );
    return cheapest?.price;
  }

  /**
   * Find earlier date tour for the given travel
   * @param travel travel target
   * @returns earlier date
   */
  async findFirstAvailableDateByTravel(travel: Travel) {
    const earlier = await this.em.findOne(
      Tour,
      { travel: { id: travel.id } },
      { populate: ['travel'], orderBy: { startDate: 'ASC' } },
    );
    return earlier?.startDate;
  }
}
