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

const UserClears: React.FC = () => {
  const [entryToEdit, setEntryToEdit] = useState<ClearEntry | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_USER_CLEAR_ENTRIES, {
    fetchPolicy: 'network-only', // Don't use cache, always make a network request
    notifyOnNetworkStatusChange: true, // This will trigger loading state on refetch
  });

  const handleEditClick = (entry: ClearEntry) => {
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

  return (
    <UserClearsContext.Provider value={clearsContextValue}>
      <ClearsTable
        clearEntries={clearEntries as ClearEntry[]}
        showIndex={true}
        isOwnProfile={true}
        onEdit={handleEditClick}
      />
      {isEditModalOpen && (
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
