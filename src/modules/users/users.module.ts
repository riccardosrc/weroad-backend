import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Role, User])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
