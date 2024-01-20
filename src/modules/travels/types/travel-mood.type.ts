import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType({ isAbstract: true })
export class TravelMoodType {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  culture: number;

  @Field(() => Int)
  history: number;

  @Field(() => Int)
  nature: number;

  @Field(() => Int)
  party: number;

  @Field(() => Int)
  relax: number;
}
