import { Field, InputType } from 'type-graphql';

@InputType()
export class RequestPasswordResetInput {
  @Field()
  email!: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  token!: string;

  @Field()
  newPassword!: string;
}
