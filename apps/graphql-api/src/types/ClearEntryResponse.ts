import { Field, ObjectType, Int } from 'type-graphql';
import { ClearEntryModel } from './ClearEntryModel';
import { FieldError } from './ErrorTypes';

@ObjectType()
export class ClearEntryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => ClearEntryModel, { nullable: true })
  clearEntry?: ClearEntryModel;
}

@ObjectType()
export class ClearEntriesResponse {
  @Field(() => [ClearEntryModel])
  clearEntries!: ClearEntryModel[];

  @Field(() => Int)
  totalCount!: number;
}
