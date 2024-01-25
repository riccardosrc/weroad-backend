import { Test, TestingModule } from '@nestjs/testing';
import { ToursResolver } from './tours.resolver';
import { ToursService } from './tours.service';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Tour } from './entities/tour.entity';

describe('ToursResolver', () => {
  let resolver: ToursResolver;
  let service: ToursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursResolver,
        { provide: ToursService, useValue: createMock<ToursService>() },
      ],
    }).compile();

    resolver = module.get<ToursResolver>(ToursResolver);
    service = module.get<ToursService>(ToursService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTour', () => {
    it('should return the created tour', async () => {
      service.create = jest
        .fn()
        .mockImplementationOnce((data) => Promise.resolve(data));

      const dto = {
        name: 'test',
        price: 1000,
        startDate: new Date(),
        travelId: 'travel-1',
      };
      const result = await resolver.createTour(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result.name).toBe('test');
    });
  });

  describe('updateTour', () => {
    it('should return the updated tour', async () => {
      service.update = jest
        .fn()
        .mockImplementationOnce((id, data) => Promise.resolve({ id, ...data }));

      const dto = {
        price: 1000,
        startDate: new Date(),
      };
      const result = await resolver.updateTour('tour-1', dto);

      expect(service.update).toHaveBeenCalledWith('tour-1', dto);
      expect(result.id).toBe('tour-1');
    });
  });

  describe('findOne', () => {
    it('should return the tour for the given id', async () => {
      service.findOne = jest
        .fn()
        .mockImplementationOnce((id) => Promise.resolve({ id }));

      const result = await resolver.findOne('tour-1');

      expect(service.findOne).toHaveBeenCalledWith('tour-1');
      expect(result.id).toBe('tour-1');
    });
    it('should throw not found error', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await resolver.findOne('tour-1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('price', () => {
    it('should return the tour price as float', async () => {
      const result = resolver.price({ price: 99900 } as Tour);

      expect(result).toBe(999.0);
    });
  });
});
