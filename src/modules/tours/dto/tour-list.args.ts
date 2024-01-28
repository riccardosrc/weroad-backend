import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsISO8601, IsInt, IsOptional, IsUUID } from 'class-validator';
import { PaginationArgs } from 'src/shared/dto/pagination.args';

@ArgsType()
export class TourListArgs extends PaginationArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  travelId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value * 100)
  priceFrom?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value * 100)
  priceTo?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsISO8601()
  dateFrom?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsISO8601()
  dateTo?: Date;

  @Field({ nullable: true })
  @IsOptional()
  orderByPrice?: 'ASC' | 'DESC';
}
