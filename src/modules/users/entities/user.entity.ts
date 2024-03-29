import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { hash, compare } from 'bcrypt';

import { Role } from './role.entity';
import { RolesService } from '../roles.service';

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

  @BeforeCreate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  /**
   * compare provided password with the hashed one of the user
   * @param password password to compare
   * @returns match result
   */
  async comparePassword(password: string) {
    const isEqual = await compare(password, this.password);
    return isEqual;
  }

  get isAdmin() {
    if (!this.roles || this.roles.length === 0) {
      return false;
    }
    return !!this.roles.find((role) => role.name === RolesService.adminRole);
  }
}
