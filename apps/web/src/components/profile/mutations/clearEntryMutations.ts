import { gql } from '@apollo/client';

export const ADD_CLEAR_ENTRY = gql`
  mutation CreateClearEntry($data: ClearEntryInput!) {
    createClearEntry(data: $data) {
      clearEntry {
        shotType
        game
        isNoDeaths
        isNoBombs
        isNo3rdCondition
        numberOfDeaths
        numberOfBombs
        videoLink
        replayLink
      }
      errors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CLEAR_ENTRY = gql`
  mutation UpdateClearEntry($data: UpdateClearEntryInput!) {
    updateClearEntry(data: $data) {
      clearEntry {
        public_uuid
        shotType
        game
        difficulty
        isNoDeaths
        isNoBombs
        isNo3rdCondition
        numberOfDeaths
        numberOfBombs
        videoLink
        replayLink
      }
      errors {
        field
        message
      }
    }
  }
`;

export const DELETE_CLEAR_ENTRY = gql`
  mutation DeleteClearEntry($publicUuid: String!) {
    deleteClearEntry(publicUuid: $publicUuid)
  }
`;
