import React from 'react';
import { gql, useQuery } from '@apollo/client';
import ClearsTable, { ClearEntry } from './ClearsTable';
import LoadingSpinner from '../LoadingSpinner';

// Query to get user's recent clears by UUID
const GET_USER_CLEAR_ENTRIES_BY_UUID = gql`
  query GetUserClearEntries($publicUuid: String!) {
    userClearEntries(userPublicUuid: $publicUuid) {
      clearEntries {
        public_uuid
        game
        shotType
        achievementType
        danmaku_points
        isNoDeaths
        isNoBombs
        isNo3rdCondition
        numberOfDeaths
        numberOfBombs
        videoLink
        replayLink
        dateAchieved
        createdAt
      }
      totalCount
    }
  }
`;

interface RecentClearsProps {
  profileUuid?: string;
  isViewOnly?: boolean;
}

const RecentClears: React.FC<RecentClearsProps> = ({ profileUuid, isViewOnly = false }) => {
  const { data, loading, error } = useQuery(GET_USER_CLEAR_ENTRIES_BY_UUID, {
    variables: { publicUuid: profileUuid || 'me' },
    fetchPolicy: 'cache-first',
  });

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
        Recent Clears
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
          <p>Error loading clears: {error.message}</p>
        </div>
      ) : data?.userClearEntries?.clearEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <ClearsTable
            clearEntries={
              [...data.userClearEntries.clearEntries]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5) as ClearEntry[]
            }
            showIndex={false}
            isOwnProfile={!isViewOnly}
          />
        </div>
      ) : (
        <p className="text-gray-400">No clears submitted yet.</p>
      )}
    </div>
  );
};

export default RecentClears;
