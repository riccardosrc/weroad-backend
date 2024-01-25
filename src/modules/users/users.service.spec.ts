import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MikroORM, UniqueConstraintViolationException } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { EntityManager, defineConfig } from '@mikro-orm/postgresql';
import { createMock } from '@golevelup/ts-jest';
import { RolesService } from './roles.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let em: EntityManager;
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MikroORM,
          useValue: MikroORM.init(
            defineConfig({
              connect: false,
              clientUrl: 'test',
              schema: 'test',
              entities: [User],
            }),
          ),
        },
        { provide: EntityManager, useValue: createMock<EntityManager>() },
        { provide: RolesService, useValue: createMock<RolesService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      email: 'test@test.com',
      password: 'test',
      roleIds: ['role-1'],
    };
    it('should create new user', async () => {
      rolesService.findByIds = jest
        .fn()
        .mockResolvedValueOnce([{ id: 'role-1', name: 'admin' }]);
      em.create = jest.fn().mockImplementationOnce((entity, data) => data);

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(rolesService.findByIds).toHaveBeenCalledWith(dto.roleIds);
      expect(em.create).toHaveBeenCalledWith(User, expect.any(Object));
      expect(em.persistAndFlush).toHaveBeenCalled();
    });
    it('should throw error for invalid roles', async () => {
      rolesService.findByIds = jest.fn().mockResolvedValueOnce([]);

      try {
        await service.create(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should throw error for conflict email', async () => {
      rolesService.findByIds = jest
        .fn()
        .mockResolvedValueOnce([{ id: 'role-1', name: 'admin' }]);
      em.create = jest.fn().mockImplementationOnce((entity, data) => data);
      em.persistAndFlush = jest
        .fn()
        .mockRejectedValueOnce(
          new UniqueConstraintViolationException(new Error()),
        );

      try {
        await service.create(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('findAll', () => {
    it('should return users and count', async () => {
      em.findAndCount = jest
        .fn()
        .mockResolvedValueOnce([[{ id: 'user-1' }], 1]);

      const result = await service.findAll({ offset: 0, limit: 10 });

      expect(result.users).toBeInstanceOf(Array);
      expect(result.count).toBe(1);
      expect(em.findAndCount).toHaveBeenCalledWith(
        User,
        {},
        { offset: 0, limit: 10 },
      );
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ id: 'user-1' });

      const result = await service.findOne('user-1', false);

      expect(result).toBeDefined();
      expect(em.findOne).toHaveBeenCalledWith(
        User,
        { id: 'user-1' },
        { populate: [] },
      );
    });
    it('should return user by id with roles population', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ id: 'user-1' });

      const result = await service.findOne('user-1', true);

      expect(result).toBeDefined();
      expect(em.findOne).toHaveBeenCalledWith(
        User,
        { id: 'user-1' },
        { populate: ['roles'] },
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@test.com' });

      const result = await service.findByEmail('test@test.com');

      expect(result).toBeDefined();
      expect(em.findOne).toHaveBeenCalledWith(User, { email: 'test@test.com' });
    });
    it("should return undefined if the user doesn't exists", async () => {
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await service.findByEmail('test@test.com');

      expect(result).toBeUndefined();
    });
  });
});
