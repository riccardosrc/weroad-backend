import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { RolesService } from './roles.service';

@Module({
  imports: [MikroOrmModule.forFeature([Role, User])],
  providers: [UsersResolver, UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
