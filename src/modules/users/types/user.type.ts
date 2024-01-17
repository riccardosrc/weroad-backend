import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleType } from './role.type';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => [RoleType])
  roles: RoleType[];
}
