import { Field, InputType, Int } from '@nestjs/graphql';
import { Min, ValidateNested, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { TravelType } from '../types/travel.type';
import { CreateTravelMoodInput } from './create-travel-mood.input';

@InputType()
export class CreateTravelInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  isPublic: boolean;

  @Field(() => Int)
  @Min(0)
  days: number;

  @Field()
  @Matches(/^[a-zA-Z0-9-]+$/)
  @Transform(({ value }) => (value as string).toLowerCase())
  slug: string;

  @Field(() => CreateTravelMoodInput)
  @ValidateNested()
  @Type(() => CreateTravelMoodInput)
  mood: CreateTravelMoodInput;
}
