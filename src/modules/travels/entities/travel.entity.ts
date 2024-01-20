import {
  Cascade,
  Entity,
  IntegerType,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

import { TravelMood } from './travel-mood.entity';

@Entity()
export class Travel {
  @PrimaryKey({ type: UuidType })
  id: string = v4();

  @Property()
  isPublic: boolean = false;

  @Property()
  slug: string;

  @Property()
  @Unique()
  name: string;

  @Property()
  description: string;

  @Property({ type: IntegerType })
  days: number;

  @OneToOne(() => TravelMood, { cascade: [Cascade.ALL] })
  mood: TravelMood;
}
