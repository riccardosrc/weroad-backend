import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { IsISO8601, IsInt, IsUUID } from 'class-validator';

@ObjectType()
export class TourListArgs {
  @Field()
  @IsUUID('4')
  travelId: string;

  @Field(() => Int)
  @IsInt()
  priceFrom: number;

  @Field(() => Int)
  @IsInt()
  priceTo: number;

  @Field(() => GraphQLISODateTime)
  @IsISO8601()
  dateFrom: Date;

  @Field(() => GraphQLISODateTime)
  @IsISO8601()
  dateTo: Date;
}
