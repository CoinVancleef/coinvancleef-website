import React, { createContext, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import { getGameName, formatShotType, formatDate } from '../../utils/formatters';
import { TouhouGame, AchievementType } from '../../touhou-types/enums';
import LoadingSpinner from '../LoadingSpinner';

// Create a context for refetching user clears
export const UserClearsContext = createContext({
  refetchClears: (): Promise<any> => Promise.resolve(),
});

// Hook to access the refetch function
export const useUserClears = () => useContext(UserClearsContext);

const GET_USER_CLEAR_ENTRIES = gql`
  query GetUserClearEntries {
    userClearEntries(userPublicUuid: "me") {
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

const UserClears: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_CLEAR_ENTRIES, {
    fetchPolicy: 'network-only', // Don't use cache, always make a network request
    notifyOnNetworkStatusChange: true, // This will trigger loading state on refetch
  });

  React.useEffect(() => {
    console.log('UserClears component mounted or data changed');
    if (data) {
      console.log('Current data:', data.userClearEntries?.clearEntries?.length, 'entries');
    }
  }, [data]);

  // Create a value for the context
  const clearsContextValue = {
    refetchClears: async (): Promise<any> => {
      console.log('refetchClears called');
      try {
        const result = await refetch();
        console.log(
          'Successfully refetched clear entries:',
          result.data.userClearEntries?.clearEntries?.length,
          'entries',
        );
        return result;
      } catch (err) {
        console.error('Error refetching clear entries:', err);
        throw err;
      }
    },
  };

  if (loading) {
    return (
      <UserClearsContext.Provider value={clearsContextValue}>
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      </UserClearsContext.Provider>
    );
  }

  if (error) {
    return (
      <UserClearsContext.Provider value={clearsContextValue}>
        <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
          <p>Error loading clears: {error.message}</p>
        </div>
      </UserClearsContext.Provider>
    );
  }

  const clearEntries = data?.userClearEntries?.clearEntries || [];

  if (clearEntries.length === 0) {
    return (
      <UserClearsContext.Provider value={clearsContextValue}>
        <div className="text-center py-8 text-gray-400">
          <p>You haven't submitted any clears yet</p>
          <p className="mt-2">Add your first clear by clicking the "Add New Clear" button</p>
        </div>
      </UserClearsContext.Provider>
    );
  }

  // Get conditions as a string (NB = No Bombs, NM = No Miss, NT = No Third Condition)
  const getConditionString = clearEntry => {
    const conditions = [];
    if (clearEntry.isNoBombs) conditions.push('NB');
    if (clearEntry.isNoDeaths) conditions.push('NM');
    if (clearEntry.isNo3rdCondition) conditions.push('NT');
    return conditions.length > 0 ? conditions.join(', ') : 'None';
  };

  // Check if a clear has a video or replay link
  const hasLinks = clearEntry => clearEntry.videoLink || clearEntry.replayLink;

  // Format achievement type for display
  const formatAchievementType = type => {
    switch (type) {
      case 'LNN':
        return 'LNN';
      case 'LNB_PLUS':
        return 'LNB+';
      case 'LNB':
        return 'LNB';
      case 'L1CC':
        return 'L1CC';
      default:
        return type;
    }
  };

  return (
    <UserClearsContext.Provider value={clearsContextValue}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Game
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Shot
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Conditions
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Points
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Links
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {clearEntries.map((clearEntry, index) => (
              <tr
                key={clearEntry.public_uuid}
                className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {getGameName(clearEntry.game as TouhouGame)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatShotType(clearEntry.game as TouhouGame, clearEntry.shotType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatAchievementType(clearEntry.achievementType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {getConditionString(clearEntry)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                  {clearEntry.danmaku_points.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(clearEntry.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {hasLinks(clearEntry) ? (
                    <div className="flex space-x-2">
                      {clearEntry.videoLink && (
                        <a
                          href={clearEntry.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          Video
                        </a>
                      )}
                      {clearEntry.replayLink && (
                        <a
                          href={clearEntry.replayLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          Replay
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </UserClearsContext.Provider>
  );
};

export default UserClears;
