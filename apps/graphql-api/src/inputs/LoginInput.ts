import { Field, InputType } from 'type-graphql';
import { IsEmail, Length } from 'class-validator';
import type { User } from 'database';

/**
 * Input type for user login
 * Matches a subset of the User type
 */
@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(6, 255)
  password!: string;
}
