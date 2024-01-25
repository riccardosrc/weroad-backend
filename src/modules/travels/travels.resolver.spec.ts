import { Test, TestingModule } from '@nestjs/testing';
import { TravelsResolver } from './travels.resolver';
import { TravelsService } from './travels.service';
import { ToursService } from '../tours/tours.service';
import { createMock } from '@golevelup/ts-jest';
import { CreateTravelInput } from './dto/create-travel.input';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Travel } from './entities/travel.entity';

describe('TravelsResolver', () => {
  let resolver: TravelsResolver;
  let service: TravelsService;
  let toursService: ToursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelsResolver,
        { provide: TravelsService, useValue: createMock<TravelsService>() },
        { provide: ToursService, useValue: createMock<ToursService>() },
      ],
    }).compile();

    resolver = module.get<TravelsResolver>(TravelsResolver);
    service = module.get<TravelsService>(TravelsService);
    toursService = module.get<ToursService>(ToursService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTravel', () => {
    it('should return the created travel', async () => {
      service.createTravel = jest
        .fn()
        .mockImplementationOnce((data) => Promise.resolve(data));

      const dto: CreateTravelInput = {
        name: 'test',
        days: 1000,
        slug: 'travel-1',
        description: 'test',
        image: 'test',
        isPublic: true,
        mood: {
          culture: 10,
          relax: 10,
          party: 10,
          history: 10,
          nature: 10,
        },
      };

      const result = await resolver.createTravel(dto);

      expect(service.createTravel).toHaveBeenCalledWith(dto);
      expect(result.name).toBe('test');
      expect(result.mood.nature).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return the travel for the given id (public)', async () => {
      service.findOne = jest
        .fn()
        .mockImplementationOnce((id) =>
          Promise.resolve({ id, isPublic: true }),
        );

      const result = await resolver.findOne(undefined, 'travel-1');

      expect(service.findOne).toHaveBeenCalledWith('travel-1');
      expect(result.id).toBe('travel-1');
    });
    it('should return the private travel for the given id (admin)', async () => {
      service.findOne = jest
        .fn()
        .mockImplementationOnce((id) =>
          Promise.resolve({ id, isPublic: false }),
        );

      const result = await resolver.findOne(
        { isAdmin: true } as User,
        'travel-1',
      );

      expect(service.findOne).toHaveBeenCalledWith('travel-1');
      expect(result.id).toBe('travel-1');
    });
    it('should throw forbidden if the travel is not public without auth (public)', async () => {
      service.findOne = jest
        .fn()
        .mockImplementationOnce((id) =>
          Promise.resolve({ id, isPublic: false }),
        );

      try {
        await resolver.findOne(undefined, 'travel-1');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
    it('should throw not found error', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await resolver.findOne(undefined, 'travel-1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findOneBySlug', () => {
    it('should return the travel for the given slug (public)', async () => {
      service.findOneBySlug = jest
        .fn()
        .mockImplementationOnce((slug) =>
          Promise.resolve({ slug, isPublic: true }),
        );

      const result = await resolver.findOneBySlug(undefined, 'travel-1');

      expect(service.findOneBySlug).toHaveBeenCalledWith('travel-1');
      expect(result.slug).toBe('travel-1');
    });
    it('should return the private travel for the given id (admin)', async () => {
      service.findOneBySlug = jest
        .fn()
        .mockImplementationOnce((slug) =>
          Promise.resolve({ slug, isPublic: false }),
        );

      const result = await resolver.findOneBySlug(
        { isAdmin: true } as User,
        'travel-1',
      );

      expect(service.findOneBySlug).toHaveBeenCalledWith('travel-1');
      expect(result.slug).toBe('travel-1');
    });
    it('should throw forbidden if the travel is not public without auth (public)', async () => {
      service.findOneBySlug = jest
        .fn()
        .mockImplementationOnce((slug) =>
          Promise.resolve({ slug, isPublic: false }),
        );

      try {
        await resolver.findOneBySlug(undefined, 'travel-1');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
    it('should throw not found error', async () => {
      service.findOneBySlug = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await resolver.findOneBySlug(undefined, 'travel-1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteTravel', () => {
    it('should delete the travel for the given id', async () => {
      service.findOne = jest
        .fn()
        .mockImplementationOnce((id) => Promise.resolve({ id }));

      const result = await resolver.deleteTravel('travel-1');

      expect(service.findOne).toHaveBeenCalledWith('travel-1');
      expect(service.deleteTravel).toHaveBeenCalledWith({ id: 'travel-1' });
      expect(result.message).toBeDefined();
    });

    it('should throw not found error', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await resolver.deleteTravel('travel-1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('mood', () => {
    it('should return travel mood', async () => {
      service.getTravelMood = jest
        .fn()
        .mockResolvedValueOnce({ id: 'mood-travel-1', culture: 10 });

      const result = await resolver.mood({ id: 'travel-1' } as Travel);

      expect(result.culture).toBe(10);
      expect(service.getTravelMood).toHaveBeenCalledWith({ id: 'travel-1' });
    });
  });

  describe('nights', () => {
    it('should return travel nights', async () => {
      const result = await resolver.nights({ days: 10 } as Travel);

      expect(result).toBe(9);
    });
  });

  describe('tours', () => {
    it('should return travel tours', async () => {
      service.getTravelTours = jest
        .fn()
        .mockResolvedValueOnce([{ id: 'tour-1' }]);

      const result = await resolver.tours({ id: 'travel-1' } as Travel);

      expect(result[0].id).toBe('tour-1');
      expect(service.getTravelTours).toHaveBeenCalledWith({ id: 'travel-1' });
    });
  });

  describe('cheapestTour', () => {
    it('should return the cheapest tour price for the given travel', async () => {
      toursService.findCheapestPriceByTravel = jest
        .fn()
        .mockResolvedValueOnce(99900);

      const result = await resolver.cheapestTour({ id: 'travel-1' } as Travel);

      expect(result).toBe(999);
      expect(toursService.findCheapestPriceByTravel).toHaveBeenCalledWith({
        id: 'travel-1',
      });
    });
    it('should return undefined if the given travel has no tours', async () => {
      toursService.findCheapestPriceByTravel = jest
        .fn()
        .mockResolvedValueOnce(undefined);

      const result = await resolver.cheapestTour({ id: 'travel-1' } as Travel);

      expect(result).toBeUndefined();
    });
  });

  describe('firstAvailableDate', () => {
    it('should return the first available date for the given travel', async () => {
      toursService.findFirstAvailableDateByTravel = jest
        .fn()
        .mockResolvedValueOnce(new Date());

      const result = await resolver.firstAvailableDate({
        id: 'travel-1',
      } as Travel);

      expect(result).toBeInstanceOf(Date);
      expect(toursService.findFirstAvailableDateByTravel).toHaveBeenCalledWith({
        id: 'travel-1',
      });
    });
    it('should return undefined if the given travel has no tours', async () => {
      toursService.findFirstAvailableDateByTravel = jest
        .fn()
        .mockResolvedValueOnce(undefined);

      const result = await resolver.firstAvailableDate({
        id: 'travel-1',
      } as Travel);

      expect(result).toBeUndefined();
    });
  });
});
