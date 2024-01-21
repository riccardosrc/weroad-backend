import { ConflictException, Injectable } from '@nestjs/common';
import {
  Collection,
  EntityManager,
  FilterQuery,
  UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';

import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { Tour } from '../tours/entities/tour.entity';
import { Travel } from './entities/travel.entity';
import { TravelMood } from './entities/travel-mood.entity';
import { CreateTravelInput } from './dto/create-travel.input';

@Injectable()
export class TravelsService {
  constructor(private em: EntityManager) {}

  /**
   * create new travel
   * @param createTravelInput travel data
   * @returns created travel
   */
  async createTravel(createTravelInput: CreateTravelInput) {
    const { mood, ...travelInput } = createTravelInput;
    const travelMood = this.em.create(TravelMood, mood);
    const travel = this.em.create(Travel, {
      ...travelInput,
      mood: travelMood,
    });
    try {
      await this.em.persistAndFlush([travelMood, travel]);
      return travel;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException('travel name already in use');
      }
      throw error;
    }
  }

  /**
   * get all travels in a paginated way.
   * @param pagination pagination options
   * @param isPublic if true return only public travels
   * @returns list of travels
   */
  async findAll({ offset, limit }: PaginationArgs, isPublic: boolean) {
    const conditions: FilterQuery<Travel> = {};
    if (isPublic) {
      conditions.isPublic = true;
    }
    const [travels, count] = await this.em.findAndCount(Travel, conditions, {
      offset,
      limit,
    });
    return { travels, count };
  }

  /**
   * find travel with provided id
   * @param id travel id
   * @returns found travel
   */
  async findOne(id: string) {
    const travel = await this.em.findOne(Travel, { id });
    return travel;
  }

  /**
   * delete provided travel
   * @param travel travel top delete
   */
  async deleteTravel(travel: Travel) {
    await this.em.removeAndFlush(travel);
  }

  /**
   * get travel mood informations
   * @param travel travel to populate
   * @returns travel mood
   */
  async getTravelMood(travel: Travel): Promise<TravelMood> {
    const { mood } = await this.em.populate(travel, ['mood']);
    return mood;
  }

  /**
   * get travel mood informations
   * @param travel travel to populate
   * @returns travel mood
   */
  async getTravelTours(travel: Travel): Promise<Collection<Tour>> {
    const { tours } = await this.em.populate(travel, ['tours']);
    return tours;
  }
}
