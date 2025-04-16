// Add Clear related types to the generated GraphQL types
export type Clear = {
  __typename?: 'Clear';
  id: Scalars['ID'];
  game: Scalars['String'];
  shotType: Scalars['String'];
  noBombs?: Maybe<Scalars['Boolean']>;
  noMiss?: Maybe<Scalars['Boolean']>;
  noThirdCondition?: Maybe<Scalars['Boolean']>;
  deaths?: Maybe<Scalars['Int']>;
  bombs?: Maybe<Scalars['Int']>;
  videoLink?: Maybe<Scalars['String']>;
  replayLink?: Maybe<Scalars['String']>;
  danmakuPoints: Scalars['Int'];
  user: User;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type AddClearMutationVariables = Exact<{
  game: Scalars['String'];
  shotType: Scalars['String'];
  noBombs?: Maybe<Scalars['Boolean']>;
  noMiss?: Maybe<Scalars['Boolean']>;
  noThirdCondition?: Maybe<Scalars['Boolean']>;
  deaths?: Maybe<Scalars['Int']>;
  bombs?: Maybe<Scalars['Int']>;
  videoLink?: Maybe<Scalars['String']>;
  replayLink?: Maybe<Scalars['String']>;
}>;

export type AddClearMutation = {
  __typename?: 'Mutation';
  addClear: {
    __typename?: 'Clear';
    id: string;
    game: string;
    shotType: string;
    danmakuPoints: number;
  };
};
