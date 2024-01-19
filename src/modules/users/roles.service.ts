import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EnsureRequestContext, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private logger: Logger;
  static readonly adminRole = 'admin';

  constructor(
    private em: EntityManager,
    private readonly orm: MikroORM,
  ) {
    this.logger = new Logger(RolesService.name);
  }

  /**
   * Creates new role
   * @param name role name
   * @returns created role
   */
  private async create(name: string) {
    const newRole = this.em.create(Role, { name });
    await this.em.persistAndFlush(newRole);
    return newRole;
  }

  /**
   * Retrieve all available roles
   * @returns roles list
   */
  async findAll() {
    const roles = await this.em.findAll(Role);
    return roles;
  }

  /**
   * find role by id
   * @param id role id
   * @returns role
   */
  async findOne(id: string) {
    const role = await this.em.findOne(Role, { id: id });
    if (!role) {
      throw new NotFoundException(`role with id ${id} not found`);
    }
    return role;
  }

  /**
   * get roles that match a list of ids
   * @param ids role ids
   * @returns roles with matching ids
   */
  async findByIds(ids: string[]) {
    const roles = await this.em.findAll(Role, {
      where: { id: { $in: ids } },
    });
    return roles;
  }

  /**
   * Seed admin role if it is missing
   * @returns created admin role
   */
  @EnsureRequestContext()
  async seedAdminRole() {
    const existingRole = await this.em.findOne(Role, {
      name: RolesService.adminRole,
    });
    if (existingRole) {
      return;
    }
    const adminRole = await this.create(RolesService.adminRole);
    this.logger.log('role seed completed');
    return adminRole;
  }
}
