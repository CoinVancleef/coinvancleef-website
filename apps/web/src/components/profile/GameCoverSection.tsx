import React, { useState } from 'react';
import { TouhouGame, GAME_DISPLAY_NAMES } from '../../touhou-types/enums';
import ClearsTable, { ClearEntry } from './ClearsTable';
import GameCoverGrid from '../GameCoverGrid';
import ClearEntryModal from './ClearEntryModal';
import { useUserClears, GET_USER_CLEAR_ENTRIES_BY_UUID } from './UserClears';
import { useQuery } from '@apollo/client';
import LoadingSpinner from '../LoadingSpinner';

interface GameCoverSectionProps {
  profileUuid?: string;
  isViewOnly?: boolean;
}

const GameCoverSection: React.FC<GameCoverSectionProps> = ({ profileUuid, isViewOnly = false }) => {
  const [selectedGame, setSelectedGame] = useState<TouhouGame | null>(null);
  const [entryToEdit, setEntryToEdit] = useState<ClearEntry | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleGameSelect = (game: TouhouGame) => {
    setSelectedGame(game === selectedGame ? null : game);
  };

  const handleEditClick = (entry: ClearEntry) => {
    if (isViewOnly) return;
    setEntryToEdit(entry);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEntryToEdit(undefined);
  };

  // Filter entries by selected game
  const filteredEntries = selectedGame
    ? clearEntries.filter(entry => entry.game === selectedGame)
    : [];

  const isLoading = !hasContextData && loading;
  const isError = !hasContextData && error;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-700 overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Clears By Game</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
          <p>Error loading clears: {error?.message}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <GameCoverGrid onGameSelect={handleGameSelect} selectedGame={selectedGame} />

          {selectedGame && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Clears for {GAME_DISPLAY_NAMES[selectedGame]}
              </h3>

              {filteredEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <ClearsTable
                    clearEntries={filteredEntries}
                    showIndex={true}
                    isOwnProfile={!isViewOnly}
                    onEdit={isViewOnly ? undefined : handleEditClick}
                  />
                </div>
              ) : (
                <p className="text-gray-400 py-4">No clears submitted for this game yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {isEditModalOpen && !isViewOnly && (
        <ClearEntryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          entryToEdit={entryToEdit}
        />
      )}
    </div>
  );
};

export default GameCoverSection;
