import React, { createContext, useContext, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import ClearsTable, { ClearEntry } from './ClearsTable';
import LoadingSpinner from '../LoadingSpinner';
import ClearEntryModal from './ClearEntryModal';

// Create a context for refetching user clears
export const UserClearsContext = createContext({
  refetchClears: (): Promise<any> => Promise.resolve(),
});

// Hook to access the refetch function
export const useUserClears = () => useContext(UserClearsContext);

// Query for own clears (with "me")
export const GET_USER_CLEAR_ENTRIES = gql`
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

// Query for another user's clears
export const GET_USER_CLEAR_ENTRIES_BY_UUID = gql`
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

interface UserClearsProps {
  profileUuid?: string;
  isViewOnly?: boolean;
}

const UserClears: React.FC<UserClearsProps> = ({ profileUuid, isViewOnly = false }) => {
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

  // Extract clear entries from the appropriate data structure
  const clearEntries = usePersonalQuery
    ? data?.userClearEntries?.clearEntries || []
    : data?.userClearEntries?.clearEntries || [];

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

  return (
    <UserClearsContext.Provider value={clearsContextValue}>
      <ClearsTable
        clearEntries={clearEntries as ClearEntry[]}
        showIndex={true}
        isOwnProfile={!isViewOnly}
        onEdit={isViewOnly ? undefined : handleEditClick}
      />
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
