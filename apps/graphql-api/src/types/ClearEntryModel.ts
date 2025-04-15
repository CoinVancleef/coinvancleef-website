import { Field, ObjectType, ID, Int } from 'type-graphql';
import { UserModel } from './UserModel';
import { AchievementType, ClearEntry } from 'database';

@ObjectType('GQLClearEntryModel')
export class ClearEntryModel implements Omit<ClearEntry, 'id' | 'userId' | 'createdBy'> {
  @Field(() => String)
  public_uuid!: string;

  @Field(() => String)
  shotType!: string;

  @Field(() => String)
  game!: string;

  @Field(() => String)
  achievementType!: AchievementType;

  @Field(() => Int)
  danmaku_points!: number;

  @Field(() => String, { nullable: true })
  replayLink?: string | null;

  @Field(() => String, { nullable: true })
  videoLink?: string | null;

  @Field(() => Boolean)
  verified!: boolean;

  @Field(() => Date, { nullable: true })
  dateAchieved?: Date | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => UserModel)
  createdBy!: UserModel;
}
