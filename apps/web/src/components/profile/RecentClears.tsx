import React from 'react';
import ClearsTable, { ClearEntry } from './ClearsTable';
import LoadingSpinner from '../LoadingSpinner';
import { useUserClears, UserClearsContext, GET_USER_CLEAR_ENTRIES_BY_UUID } from './UserClears';
import { useQuery } from '@apollo/client';

interface RecentClearsProps {
  profileUuid?: string;
  isViewOnly?: boolean;
}

const RecentClears: React.FC<RecentClearsProps> = ({ profileUuid, isViewOnly = false }) => {
  // Use the context if available, otherwise make a query
  const context = useUserClears();
  const hasContextData = context.clearEntries && context.clearEntries.length > 0;

  // If we don't have data from context, we need to make our own query
  const { data, loading, error } = useQuery(GET_USER_CLEAR_ENTRIES_BY_UUID, {
    variables: { publicUuid: profileUuid || 'me' },
    fetchPolicy: 'cache-first',
    skip: hasContextData, // Skip query if we have data from context
  });

  // Get clear entries either from context or from our own query
  const clearEntries = hasContextData
    ? context.clearEntries
    : (data?.userClearEntries?.clearEntries as ClearEntry[]) || [];

  // Sort by creation date and take the most recent 5
  const recentEntries = [...clearEntries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const isLoading = !hasContextData && loading;
  const isError = !hasContextData && error;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
        Recent Clears
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
          <p>Error loading clears: {error?.message}</p>
        </div>
      ) : recentEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <ClearsTable clearEntries={recentEntries} showIndex={false} isOwnProfile={!isViewOnly} />
        </div>
      ) : (
        <p className="text-gray-400">No clears submitted yet.</p>
      )}
    </div>
  );
};

export default RecentClears;
