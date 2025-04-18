import React, { createContext, useContext, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import ClearsTable, { ClearEntry } from './ClearsTable';
import GameClears from './GameClears';
import LoadingSpinner from '../LoadingSpinner';
import ClearEntryModal from './ClearEntryModal';

// Create a context for refetching user clears
export const UserClearsContext = createContext({
  refetchClears: (): Promise<any> => Promise.resolve(),
  clearEntries: [] as ClearEntry[],
});

// Hook to access the refetch function and clear entries
export const useUserClears = () => useContext(UserClearsContext);

// Query to get user's clear entries with all needed fields
export const GET_USER_CLEAR_ENTRIES = gql`
  query GetUserClearEntries {
    userClearEntries {
      clearEntries {
        public_uuid
        game
        shotType
        difficulty
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

// Query to get user's clear entries by UUID with all needed fields
export const GET_USER_CLEAR_ENTRIES_BY_UUID = gql`
  query GetUserClearEntries($publicUuid: String!) {
    userClearEntries(userPublicUuid: $publicUuid) {
      clearEntries {
        public_uuid
        game
        shotType
        difficulty
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

interface UserClearsProps {
  profileUuid?: string;
  isViewOnly?: boolean;
  limit?: number;
  onLoadMore?: () => void;
  renderAs?: 'list' | 'game-view';
}

const UserClears: React.FC<UserClearsProps> = ({
  profileUuid,
  isViewOnly = false,
  limit = 10,
  onLoadMore,
  renderAs = 'list',
}) => {
  const [entryToEdit, setEntryToEdit] = useState<ClearEntry | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Determine which query to use based on if we're viewing another user
  const usePersonalQuery = !profileUuid || profileUuid === 'me';

  // Use appropriate query based on whether we're viewing own profile or another user's
  const { data, loading, error, refetch } = usePersonalQuery
    ? useQuery(GET_USER_CLEAR_ENTRIES, {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      })
    : useQuery(GET_USER_CLEAR_ENTRIES_BY_UUID, {
        variables: { publicUuid: profileUuid },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      });

  const handleEditClick = (entry: ClearEntry) => {
    if (isViewOnly) return;
    setEntryToEdit(entry);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEntryToEdit(undefined);
  };

  React.useEffect(() => {
    console.log('UserClears component mounted or data changed');
    if (data) {
      console.log('Current data:', data.userClearEntries?.clearEntries?.length, 'entries');
    }
  }, [data]);

  // Extract clear entries from the appropriate data structure
  const clearEntries = usePersonalQuery
    ? data?.userClearEntries?.clearEntries || []
    : data?.userClearEntries?.clearEntries || [];

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
    clearEntries: clearEntries as ClearEntry[],
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

  if (clearEntries.length === 0) {
    return (
      <UserClearsContext.Provider value={clearsContextValue}>
        <div className="text-center py-8 text-gray-400">
          {isViewOnly ? (
            <p>This player hasn't submitted any clears yet</p>
          ) : (
            <>
              <p>You haven't submitted any clears yet</p>
              <p className="mt-2">Add your first clear by clicking the "Add New Clear" button</p>
            </>
          )}
        </div>
      </UserClearsContext.Provider>
    );
  }

  // If rendering as game view, use the GameClears component
  if (renderAs === 'game-view') {
    return (
      <UserClearsContext.Provider value={clearsContextValue}>
        <GameClears clearEntries={clearEntries as ClearEntry[]} isViewOnly={isViewOnly} />
        {isEditModalOpen && !isViewOnly && (
          <ClearEntryModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            entryToEdit={entryToEdit}
          />
        )}
      </UserClearsContext.Provider>
    );
  }

  // Get total count of entries
  const totalEntries = clearEntries.length;
  // Apply limit to entries
  const limitedEntries = clearEntries.slice(0, limit) as ClearEntry[];
  // Check if there are more entries to load
  const hasMoreEntries = totalEntries > limit;

  return (
    <UserClearsContext.Provider value={clearsContextValue}>
      <ClearsTable
        clearEntries={limitedEntries}
        showIndex={true}
        isOwnProfile={!isViewOnly}
        onEdit={isViewOnly ? undefined : handleEditClick}
      />

      {hasMoreEntries && onLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200"
          >
            Show More ({Math.min(10, totalEntries - limit)} more of {totalEntries})
          </button>
        </div>
      )}

      {isEditModalOpen && !isViewOnly && (
        <ClearEntryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          entryToEdit={entryToEdit}
        />
      )}
    </UserClearsContext.Provider>
  );
};

export default UserClears;
