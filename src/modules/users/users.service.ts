import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { RolesService } from './roles.service';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class UsersService {
  constructor(
    private em: EntityManager,
    private rolesService: RolesService,
  ) {}

  async create({ email, password, roleIds }: CreateUserInput) {
    const roles = await this.rolesService.findByIds(roleIds);
    const user = this.em.create(User, { email, password, roles });
    await this.em.persistAndFlush(user);
    return user;
  }

  async findAll({ offset, limit }: PaginationArgs) {
    const [users, count] = await this.em.findAndCount(
      User,
      {},
      { offset, limit },
    );
    return { users, count };
  }

  async findOne(id: string) {
    const user = await this.em.findOne(User, { id: id });
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return user;
  }
}
