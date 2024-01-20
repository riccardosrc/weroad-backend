import { Field, InputType, OmitType } from '@nestjs/graphql';

import { TravelType } from '../types/travel.type';
import { CreateTravelMoodInput } from './create-travel-mood.input';

@InputType()
export class CreateTravelInput extends OmitType(
  TravelType,
  ['id', 'mood', 'nights'],
  InputType,
) {
  @Field(() => CreateTravelMoodInput)
  mood: CreateTravelMoodInput;
}
