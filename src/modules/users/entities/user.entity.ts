import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core';
import { Role } from './role.entity';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey({ type: UuidType })
  id: string = v4();

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @ManyToMany(() => Role)
  roles = new Collection<Role>(this);
}
