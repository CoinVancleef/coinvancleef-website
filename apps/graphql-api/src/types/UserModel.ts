import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Role, User } from 'database';
import { ClearEntryModel } from './ClearEntryModel';

@ObjectType('GQLUserModel')
export class UserModel implements Omit<User, 'password' | 'clearEntries' | 'id'> {
  // Skip exposing the internal ID

  @Field(() => String)
  public_uuid!: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String)
  name!: string;

  // Don't expose the password

  @Field(() => String)
  role!: Role;

  @Field(() => Int)
  danmaku_points!: number;

  @Field(() => Int)
  totalClears!: number;

  @Field(() => Int)
  lnn!: number;

  @Field(() => Int)
  lnb!: number;

  @Field(() => Int)
  l1cc!: number;

  @Field(() => Int, { nullable: true })
  globalRank?: number | null;

  @Field(() => String, { nullable: true })
  twitterHandle?: string | null;

  @Field(() => String, { nullable: true })
  youtubeChannel?: string | null;

  @Field(() => String, { nullable: true })
  twitchChannel?: string | null;

  @Field(() => String, { nullable: true })
  discord?: string | null;

  @Field(() => String, { nullable: true })
  country?: string | null;

  @Field(() => String, { nullable: true })
  profilePicture?: string | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => [ClearEntryModel], { nullable: true })
  clearEntries?: ClearEntryModel[];
}
