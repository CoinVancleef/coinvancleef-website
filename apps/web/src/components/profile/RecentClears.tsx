import React from 'react';
import { useQuery } from '@apollo/client';
import ClearsTable, { ClearEntry } from './ClearsTable';
import { GET_USER_CLEAR_ENTRIES } from './UserClears';
import LoadingSpinner from '../LoadingSpinner';

const RecentClears: React.FC = () => {
  const { data, loading, error } = useQuery(GET_USER_CLEAR_ENTRIES, {
    fetchPolicy: 'cache-first', // Use cache if available to avoid redundant network requests
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
          />
        </div>
      ) : (
        <p className="text-gray-400">No clears submitted yet.</p>
      )}
    </div>
  );
};

export default RecentClears;
