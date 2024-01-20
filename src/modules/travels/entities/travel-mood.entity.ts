import {
  Entity,
  IntegerType,
  OneToOne,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Travel } from './travel.entity';

@Entity()
export class TravelMood {
  @PrimaryKey({ type: UuidType })
  id: string = v4();

  @Property({ type: IntegerType })
  culture: number = 0;

  @Property({ type: IntegerType })
  history: number = 0;

  @Property({ type: IntegerType })
  nature: number = 0;

  @Property({ type: IntegerType })
  party: number = 0;

  @Property({ type: IntegerType })
  relax: number = 0;

  @OneToOne(() => Travel, (travel) => travel.mood)
  travel: Travel;
}
