import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EnsureRequestContext, EntityManager } from '@mikro-orm/postgresql';

import { PaginationArgs } from 'src/common/dto/pagination.args';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { RolesService } from './roles.service';
import { ConfigService } from '@nestjs/config';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private logger: Logger;

  constructor(
    private orm: MikroORM,
    private em: EntityManager,
    private rolesService: RolesService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  /**
   * Creates a new user with provided informations
   * @param createUserInput user input properties
   * @returns newly created user
   */
  async create({ email, password, roleIds }: CreateUserInput) {
    const roles = await this.rolesService.findByIds(roleIds);
    const user = this.em.create(User, { email, password, roles });
    await this.em.persistAndFlush(user);
    return user;
  }

  /**
   * retrieve users from db with pagination
   * @param paginationArgs pagination options
   * @returns paginated users list
   */
  async findAll({ offset, limit }: PaginationArgs) {
    const [users, count] = await this.em.findAndCount(
      User,
      {},
      { offset, limit },
    );
    return { users, count };
  }

  /**
   * find user by id
   * @param id user id
   * @returns found user
   */
  async findOne(id: string) {
    const user = await this.em.findOne(User, { id });
    return user;
  }

  /**
   * find user by email
   * @param email user email
   * @returns found user
   */
  async findByEmail(email: string) {
    const user = await this.em.findOne(User, { email });
    return user;
  }

  /**
   * get user roles
   * @param user target user
   * @returns user roles
   */
  async getUserRoles(user: User) {
    const { roles } = await this.em.populate(user, ['roles']);
    return roles;
  }

  @EnsureRequestContext()
  async onApplicationBootstrap() {
    this.logger.log('checking existing admin user');
    const existingAdmin = await this.em.findOne(
      User,
      { roles: { name: RolesService.adminRole } },
      { populate: ['roles'] },
    );
    console.log(existingAdmin);
    if (existingAdmin) {
      this.logger.log('admin user already in place');
      return;
    }
    this.logger.log('creating first admin user');
    const adminRole = await this.rolesService.seedAdminRole();
    const adminEmail = this.configService.get<string>('app.defaultAdminEmail');
    const adminPassword = this.configService.get<string>(
      'app.defaultAdminPassword',
    );
    await this.create({
      email: adminEmail,
      password: adminPassword,
      roleIds: [adminRole.id],
    });
    this.logger.log('first admin successfully created');
  }
}
