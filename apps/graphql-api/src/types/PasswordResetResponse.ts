import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './ErrorTypes';

@ObjectType()
export class PasswordResetResponse {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
