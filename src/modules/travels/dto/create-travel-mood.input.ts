import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class CreateTravelMoodInput {
  @Field(() => Int)
  @Min(0)
  @Max(100)
  culture: number;

  @Field(() => Int)
  @Min(0)
  @Max(100)
  history: number;

  @Field(() => Int)
  @Min(0)
  @Max(100)
  nature: number;

  @Field(() => Int)
  @Min(0)
  @Max(100)
  party: number;

  @Field(() => Int)
  @Min(0)
  @Max(100)
  relax: number;
}
