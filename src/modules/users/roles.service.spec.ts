import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager, defineConfig } from '@mikro-orm/postgresql';
import { createMock } from '@golevelup/ts-jest';
import { v4 } from 'uuid';

import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: MikroORM,
          useValue: MikroORM.init(
            defineConfig({
              connect: false,
              clientUrl: 'test',
              schema: 'test',
              entities: [Role],
            }),
          ),
        },
        { provide: EntityManager, useValue: createMock<EntityManager>() },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const roles: Role[] = [{ id: v4(), name: 'test role' }];
      em.findAll = jest.fn().mockResolvedValueOnce(roles);

      const res = await service.findAll();

      expect(res).toBeInstanceOf(Array);
      expect(res[0].name).toBe('test role');
      expect(em.findAll).toHaveBeenCalledWith(Role);
    });
  });

  describe('findOne', () => {
    it('should return role by id', async () => {
      const id = v4();
      const role: Role = { id, name: 'test role' };
      em.findOne = jest.fn().mockResolvedValueOnce(role);

      const res = await service.findOne(id);

      expect(res.name).toBe('test role');
      expect(res.id).toBe(id);
      expect(em.findOne).toHaveBeenCalledWith(Role, { id });
    });

    it('should throw not found exception', async () => {
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);

      try {
        await service.findOne('123');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findByIds', () => {
    it('should return all roles with matching ids', async () => {
      const id = v4();
      const roles: Role[] = [{ id, name: 'test role' }];
      em.findAll = jest.fn().mockResolvedValueOnce(roles);

      const res = await service.findByIds([id]);

      expect(res).toBeInstanceOf(Array);
      expect(res[0].id).toBe(id);
      expect(em.findAll).toHaveBeenCalledWith(Role, {
        where: { id: { $in: [id] } },
      });
    });
  });

  describe('seedAdminRole', () => {
    it('should create admin role if is missing', async () => {
      const mockedRole: Role = { id: v4(), name: RolesService.adminRole };
      em.findOne = jest.fn().mockResolvedValueOnce(undefined);
      em.create = jest.fn().mockReturnValueOnce(mockedRole);
      em.persistAndFlush = jest.fn().mockResolvedValueOnce(mockedRole);

      const res = await service.seedAdminRole();

      expect(res.name).toBe(mockedRole.name);
      expect(em.findOne).toHaveBeenCalledWith(Role, {
        name: RolesService.adminRole,
      });
      expect(em.create).toHaveBeenCalled();
      expect(em.persistAndFlush).toHaveBeenCalled();
    });

    it('should skip admin role role creation if exixts', async () => {
      const mockedRole: Role = { id: v4(), name: RolesService.adminRole };
      em.findOne = jest.fn().mockResolvedValueOnce(mockedRole);

      const res = await service.seedAdminRole();

      expect(res).toBeUndefined();
      expect(em.findOne).toHaveBeenCalled();
      expect(em.create).toHaveBeenCalledTimes(0);
      expect(em.persistAndFlush).toHaveBeenCalledTimes(0);
    });
  });
});
