import { Field, InputType, Int } from 'type-graphql';
import { AchievementType } from 'database';

@InputType()
export class ClearEntryInput {
  @Field(() => String)
  shotType!: string;

  @Field(() => String)
  game!: string;

  @Field(() => String)
  achievementType!: AchievementType;

  @Field(() => Int, { nullable: true })
  numberOfDeaths?: number;

  @Field(() => Int, { nullable: true })
  numberOfBombs?: number;

  @Field(() => Boolean, { nullable: true })
  isNoDeaths?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNoBombs?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNo3rdCondition?: boolean;

  @Field(() => String, { nullable: true })
  replayLink?: string;

  @Field(() => String, { nullable: true })
  videoLink?: string;

  @Field(() => Date, { nullable: true })
  dateAchieved?: Date;
}

@InputType()
export class UpdateClearEntryInput {
  @Field(() => String)
  public_uuid!: string;

  @Field(() => String, { nullable: true })
  shotType?: string;

  @Field(() => String, { nullable: true })
  game?: string;

  @Field(() => String, { nullable: true })
  achievementType?: AchievementType;

  @Field(() => Int, { nullable: true })
  numberOfDeaths?: number;

  @Field(() => Int, { nullable: true })
  numberOfBombs?: number;

  @Field(() => Boolean, { nullable: true })
  isNoDeaths?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNoBombs?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNo3rdCondition?: boolean;

  @Field(() => String, { nullable: true })
  replayLink?: string;

  @Field(() => String, { nullable: true })
  videoLink?: string;

  @Field(() => Date, { nullable: true })
  dateAchieved?: Date;
}

@InputType()
export class VerifyClearEntryInput {
  @Field(() => String)
  public_uuid!: string;

  @Field(() => Boolean)
  verified!: boolean;

  @Field(() => Int, { nullable: true })
  danmaku_points?: number;
}
