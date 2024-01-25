import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: UsersService, useValue: createMock<UsersService>() },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should return the created user', async () => {
      service.create = jest
        .fn()
        .mockImplementationOnce((data) => Promise.resolve(data));

      const dto = {
        email: 'test@test.com',
        password: 'test',
        roleIds: ['role-1'],
      };
      const result = await resolver.createUser(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result.email).toBe('test@test.com');
    });
  });

  describe('findOne', () => {
    it('should return the user for the given id', async () => {
      service.findOne = jest
        .fn()
        .mockImplementationOnce((id) => Promise.resolve({ id }));

      const result = await resolver.findOne('user-1');

      expect(service.findOne).toHaveBeenCalledWith('user-1');
      expect(result.id).toBe('user-1');
    });
    it('should throw not found error', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await resolver.findOne('user-1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getCurrentUser', () => {
    it('should return the authenticated user that made the request', async () => {
      const result = resolver.getCurrentUser({ id: 'user-1' } as User);

      expect(result.id).toBe('user-1');
    });
  });

  describe('roles', () => {
    it('should return the user roles', async () => {
      service.getUserRoles = jest
        .fn()
        .mockResolvedValueOnce([{ id: 'role-1', name: 'admin' }]);

      const result = await resolver.roles({ id: 'user-1' } as User);

      expect(result).toBeInstanceOf(Array);
      expect(result[0].name).toBe('admin');
    });
  });
});
