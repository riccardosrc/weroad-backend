import { Test, TestingModule } from '@nestjs/testing';
import { TravelsService } from './travels.service';
import { createMock } from '@golevelup/ts-jest';
import {
  EntityManager,
  UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';
import { CreateTravelInput } from './dto/create-travel.input';
import { ConflictException } from '@nestjs/common';
import { Travel } from './entities/travel.entity';

describe('TravelsService', () => {
  let service: TravelsService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelsService,
        { provide: EntityManager, useValue: createMock<EntityManager>() },
      ],
    }).compile();

    service = module.get<TravelsService>(TravelsService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTravel', () => {
    const dto: CreateTravelInput = {
      name: 'Travel1',
      slug: 'travel-1',
      days: 1,
      description: 'test',
      image: 'test',
      isPublic: true,
      mood: {
        nature: 10,
        culture: 10,
        history: 10,
        relax: 10,
        party: 10,
      },
    };
    it('should create a new travel', async () => {
      em.create = jest.fn().mockImplementation((entity, data) => data);

      const result = await service.createTravel(dto);

      expect(em.create).toHaveBeenCalledTimes(2);
      expect(em.persistAndFlush).toHaveBeenCalled();
      expect(result.name).toBe('Travel1');
      expect(result.mood.relax).toBe(10);
    });
    it('should throw an error for conflict on slug', async () => {
      em.create = jest.fn().mockImplementation((entity, data) => data);
      em.persistAndFlush = jest
        .fn()
        .mockRejectedValueOnce(
          new UniqueConstraintViolationException(new Error()),
        );

      try {
        await service.createTravel(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('findAll', () => {
    it('should find all travels', async () => {
      em.findAndCount = jest
        .fn()
        .mockResolvedValueOnce([[{ id: 'travel-1' }], 1]);

      const result = await service.findAll({ offset: 0, limit: 10 }, false);

      expect(result.travels).toBeInstanceOf(Array);
      expect(result.count).toBe(1);
      expect(em.findAndCount).toHaveBeenCalledWith(
        Travel,
        {},
        { offset: 0, limit: 10 },
      );
    });
    it('should find only public travels', async () => {
      em.findAndCount = jest
        .fn()
        .mockResolvedValueOnce([[{ id: 'travel-1' }], 1]);

      const result = await service.findAll({ offset: 0, limit: 10 }, true);

      expect(result.travels).toBeInstanceOf(Array);
      expect(result.count).toBe(1);
      expect(em.findAndCount).toHaveBeenCalledWith(
        Travel,
        { isPublic: true },
        { offset: 0, limit: 10 },
      );
    });
  });

  describe('findOne', () => {
    it('should return travel with the given id', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ id: 'travel-1' });

      const result = await service.findOne('travel-1');

      expect(em.findOne).toHaveBeenCalledWith(Travel, { id: 'travel-1' });
      expect(result).toBeDefined();
    });

    it("should return undefined if the given id doesn't exists", async () => {
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await service.findOne('travel-1');

      expect(result).toBeUndefined();
    });
  });

  describe('findOneBySlug', () => {
    it('should return travel with the given slug', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ slug: 'travel-1' });

      const result = await service.findOneBySlug('travel-1');

      expect(em.findOne).toHaveBeenCalledWith(Travel, { slug: 'travel-1' });
      expect(result).toBeDefined();
    });

    it("should return undefined if the given id doesn't exists", async () => {
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await service.findOneBySlug('travel-1');

      expect(result).toBeUndefined();
    });
  });

  describe('deleteTravel', () => {
    it('should delete the travel with the given id', async () => {
      const travel = { id: 'travel-1' } as Travel;

      await service.deleteTravel(travel);

      expect(em.removeAndFlush).toHaveBeenCalledWith(travel);
    });
  });

  describe('getTravelMood', () => {
    it('should return travel mood', async () => {
      const travel = { id: 'travel-1' } as Travel;
      em.populate = jest.fn().mockResolvedValueOnce({ mood: { culture: 10 } });

      const result = await service.getTravelMood(travel);

      expect(em.populate).toHaveBeenCalledWith(travel, ['mood']);
      expect(result.culture).toBeDefined();
    });
  });

  describe('getTravelTours', () => {
    it('should return related tours for the given travel', async () => {
      const travel = { id: 'travel-1' } as Travel;
      em.populate = jest
        .fn()
        .mockResolvedValueOnce({ tours: [{ id: 'tour-1' }] });

      const result = await service.getTravelTours(travel);

      expect(em.populate).toHaveBeenCalledWith(travel, ['tours'], {
        orderBy: { tours: { startDate: 'ASC' } },
      });
      expect(result[0].id).toBe('tour-1');
    });
  });
});
