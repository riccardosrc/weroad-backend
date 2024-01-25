import { Test, TestingModule } from '@nestjs/testing';
import { ToursService } from './tours.service';
import { TravelsService } from '../travels/travels.service';
import { createMock } from '@golevelup/ts-jest';
import {
  EntityManager,
  UniqueConstraintViolationException,
  wrap,
} from '@mikro-orm/core';
import { Tour } from './entities/tour.entity';
import { Utils } from 'src/shared/utils';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Travel } from '../travels/entities/travel.entity';

jest.mock('@mikro-orm/core', () => ({
  ...jest.requireActual('@mikro-orm/core'), // Keep the actual implementation for other functions
  wrap: jest.fn(), // Mock only the wrap function
}));

describe('ToursService', () => {
  let service: ToursService;
  let travelsService: TravelsService;
  let em: EntityManager;
  (wrap as jest.Mock).mockImplementation(() => ({
    assign: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        { provide: TravelsService, useValue: createMock<TravelsService>() },
        { provide: EntityManager, useValue: createMock<EntityManager>() },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
    travelsService = module.get<TravelsService>(TravelsService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockedTour = {
      name: 'test',
      price: 1000,
      startDate: new Date(),
      travelId: 'travel-1',
    };

    it('should create new tour', async () => {
      travelsService.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 'travel-1', days: 1 });
      em.create = jest.fn().mockImplementationOnce((entity, data) => data);

      const result = await service.create(mockedTour);

      expect(travelsService.findOne).toHaveBeenCalledWith('travel-1');
      expect(em.create).toHaveBeenCalledWith(Tour, expect.any(Object));
      expect(em.persistAndFlush).toHaveBeenCalled();
      expect(result.name).toBe('test');
      expect(result.endDate).toEqual(
        Utils.addDaysToDate(mockedTour.startDate, 1),
      );
    });

    it('should throw error for invalid travel', async () => {
      travelsService.findOne = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await service.create(mockedTour);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw error for conflict name', async () => {
      travelsService.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 'travel-1', days: 1 });
      em.create = jest.fn().mockImplementationOnce((entity, data) => data);
      em.persistAndFlush = jest
        .fn()
        .mockRejectedValueOnce(
          new UniqueConstraintViolationException(new Error()),
        );

      try {
        await service.create(mockedTour);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('update', () => {
    const updateDto = {
      price: 1000,
      startDate: new Date(),
    };

    it('should update a tour by id', async () => {
      service.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 'tour-1', travel: { days: 1 } });

      await service.update('tour-1', updateDto);

      expect(service.findOne).toHaveBeenCalledWith('tour-1');
      expect(em.flush).toHaveBeenCalled();
    });

    it('should throw error for not found tour', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await service.update('tour-1', updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findOne', () => {
    it('should return tour with the given id', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ id: 'tour-1' });

      const result = await service.findOne('tour-1');

      expect(em.findOne).toHaveBeenCalledWith(
        Tour,
        { id: 'tour-1' },
        { populate: ['travel'] },
      );
      expect(result).toBeDefined();
    });

    it("should return undefined if the given id doesn't exists", async () => {
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await service.findOne('tour-1');

      expect(result).toBeUndefined();
    });
  });

  describe('findCheapestPriceByTravel', () => {
    it('should return cheapest tour by travel', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ price: 1000 });

      const result = await service.findCheapestPriceByTravel({
        id: 'travel-1',
      } as Travel);

      expect(em.findOne).toHaveBeenCalledWith(
        Tour,
        { travel: { id: 'travel-1' } },
        { populate: ['travel'], orderBy: { price: 'ASC' } },
      );
      expect(result).toBe(1000);
    });

    it('should return undefined if there are no tours associated', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await service.findCheapestPriceByTravel({
        id: 'tour-1',
      } as Travel);

      expect(result).toBeUndefined();
    });
  });

  describe('findFirstAvailableDateByTravel', () => {
    it('should return earliest tour date by travel', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ startDate: new Date() });

      const result = await service.findFirstAvailableDateByTravel({
        id: 'travel-1',
      } as Travel);

      expect(em.findOne).toHaveBeenCalledWith(
        Tour,
        { travel: { id: 'travel-1' } },
        { populate: ['travel'], orderBy: { startDate: 'ASC' } },
      );
      expect(result).toBeInstanceOf(Date);
    });

    it('should return undefined if there are no tours associated', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await service.findFirstAvailableDateByTravel({
        id: 'tour-1',
      } as Travel);

      expect(result).toBeUndefined();
    });
  });
});
