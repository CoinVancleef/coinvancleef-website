import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './ErrorTypes';

@ObjectType()
export class PasswordChangeResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
