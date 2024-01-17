import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
