import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(5)
  password: string;

  @Field(() => [String])
  @IsUUID('4', { each: true })
  roleIds: string[];
}
