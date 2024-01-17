import { Entity, PrimaryKey, Property, UuidType } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Role {
  @PrimaryKey({ type: UuidType })
  id: string = v4();

  @Property()
  name: string;
}
