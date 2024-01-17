import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IPaginatedType<T> {
  items: T[];
  totalCount: number;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    constructor(items: T[], count: number) {
      this.items = items;
      this.totalCount = count;
    }

    @Field(() => [classRef], { nullable: true })
    items: T[];

    @Field(() => Int)
    totalCount: number;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
