import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResType {
  @Field()
  accessToken: string;
}
