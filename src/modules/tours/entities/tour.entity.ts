import {
  Cascade,
  DateType,
  Entity,
  IntegerType,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Travel } from '../../travels/entities/travel.entity';

@Entity()
export class Tour {
  @PrimaryKey({ type: UuidType })
  id: string = v4();

  @Property()
  @Unique()
  name: string;

  @Property({ type: IntegerType })
  price: number;

  @Property({ type: DateType })
  startDate: Date;

  @Property({ type: DateType })
  endDate: Date;

  @ManyToOne(() => Travel, { cascade: [Cascade.REMOVE] })
  travel: Travel;
}
