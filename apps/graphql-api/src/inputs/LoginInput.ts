import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';

/**
 * Input type for user login
 * Allows login with either username or email
 */
@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail!: string;

  @Field()
  @Length(6, 255)
  password!: string;
}
