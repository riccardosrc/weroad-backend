import {
  Field,
  GraphQLISODateTime,
  InputType,
  Int,
  OmitType,
} from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CreateTourInput } from './create-tour.input';

@InputType()
export class UpdateTourInput extends OmitType(CreateTourInput, [
  'name',
  'travelId',
]) {
  @Field(() => Int)
  @Min(0)
  price: number;

  @Field(() => GraphQLISODateTime)
  startDate: Date;
}
