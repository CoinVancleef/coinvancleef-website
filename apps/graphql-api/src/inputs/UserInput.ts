import { Field, InputType } from 'type-graphql';
import { IsEmail, Length } from 'class-validator';
import type { User } from 'database';

/**
 * Input type for user registration
 * Corresponds to a subset of the User type
 */
@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  @Length(6, 255)
  password!: string;

  @Field({ nullable: true })
  twitterHandle?: string;

  @Field({ nullable: true })
  youtubeChannel?: string;

  @Field({ nullable: true })
  twitchChannel?: string;

  @Field({ nullable: true })
  discord?: string;

  @Field({ nullable: true })
  country?: string;
}

/**
 * Input type for updating user profile
 * Contains only the fields that users can update themselves
 */
@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  twitterHandle?: string;

  @Field({ nullable: true })
  youtubeChannel?: string;

  @Field({ nullable: true })
  twitchChannel?: string;

  @Field({ nullable: true })
  discord?: string;

  @Field({ nullable: true })
  profilePicture?: string;
}
