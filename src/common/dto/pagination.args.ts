import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  @Min(0)
  offset: number = 0;

  @Field(() => Int)
  @Min(0)
  limit: number = 10;
}
