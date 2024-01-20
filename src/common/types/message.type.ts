import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageType {
  constructor(message: string) {
    this.message = message;
  }

  @Field()
  message: string;
}
