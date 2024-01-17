import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
  ) {}

  async create({ email, password }: CreateUserInput) {
    const newUser = this.usersRepository.create({ email, password });
    const id = await this.usersRepository.insert(newUser);
    return this.findOne(id);
  }

  async findAll({ offset, limit }: PaginationArgs) {
    const [users, count] = await this.usersRepository.findAndCount(
      {},
      { offset, limit },
    );
    return { users, count };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ id: id });
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return user;
  }
}
