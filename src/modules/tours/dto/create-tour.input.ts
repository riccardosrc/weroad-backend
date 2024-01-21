import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { IsUUID, Min } from 'class-validator';

@InputType()
export class CreateTourInput {
  @Field()
  name: string;

  @Field(() => Int)
  @Min(0)
  price: number;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field()
  @IsUUID('4')
  travelId: string;
}
