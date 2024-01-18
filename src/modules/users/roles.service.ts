import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { EnsureRequestContext, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Role } from './entities/role.entity';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
  private logger: Logger;

  constructor(
    private em: EntityManager,
    private readonly orm: MikroORM,
  ) {
    this.logger = new Logger(RolesService.name);
  }

  private async create(name: string) {
    const newRole = this.em.create(Role, { name });
    await this.em.persistAndFlush(newRole);
    return newRole;
  }

  async findAll() {
    const roles = await this.em.findAll(Role);
    return roles;
  }

  async findOne(id: string) {
    const role = await this.em.findOne(Role, { id: id });
    if (!role) {
      throw new NotFoundException(`role with id ${id} not found`);
    }
    return role;
  }

  async findByIds(ids: string[]) {
    const roles = await this.em.findAll(Role, {
      where: { id: { $in: ids } },
    });
    return roles;
  }

  @EnsureRequestContext()
  async onApplicationBootstrap() {
    const roles = await this.findAll();
    if (roles.length > 0) {
      return;
    }
    await this.create('admin');
    await this.create('user');
    this.logger.log('roles seed completed');
  }
}
