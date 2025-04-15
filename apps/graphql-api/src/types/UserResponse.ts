import { Field, ObjectType, Int } from 'type-graphql';
import { UserModel } from './UserModel';
import { FieldError } from './ErrorTypes';

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field({ nullable: true })
  token?: string;
}
