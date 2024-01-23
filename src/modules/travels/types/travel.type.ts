import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { TravelMoodType } from './travel-mood.type';

@ObjectType()
@InputType({ isAbstract: true })
export class TravelType {
  @Field(() => ID)
  id: string;

  @Field()
  isPublic: boolean;

  @Field()
  slug: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  days: number;

  @Field(() => Int)
  nights: number;

  @Field(() => Float)
  cheapestTour: number;

  @Field(() => GraphQLISODateTime)
  firstAvailableDate: Date;

  @Field(() => TravelMoodType)
  mood: TravelMoodType;
}
