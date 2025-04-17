import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';

/**
 * Input type for changing password
 */
@InputType()
export class ChangePasswordInput {
  @Field()
  @Length(1, 255)
  currentPassword!: string;

  @Field()
  @Length(6, 255)
  newPassword!: string;
}
