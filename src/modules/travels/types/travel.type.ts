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

  @Field()
  image: string;

  @Field(() => Int)
  days: number;

  @Field(() => Int)
  nights: number;

  @Field(() => Float, { nullable: true })
  cheapestTour?: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  firstAvailableDate?: Date;

  @Field(() => TravelMoodType)
  mood: TravelMoodType;
}
