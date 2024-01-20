import { InputType, OmitType } from '@nestjs/graphql';

import { TravelMoodType } from '../types/travel-mood.type';

@InputType()
export class CreateTravelMoodInput extends OmitType(
  TravelMoodType,
  ['id'],
  InputType,
) {}
