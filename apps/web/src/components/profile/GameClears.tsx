import React, { useState } from 'react';
import { TouhouGame } from '../../touhou-types/enums';
import ClearsTable, { ClearEntry } from './ClearsTable';
import GameCoverGrid from '../GameCoverGrid';
import { UserClearsContext } from './UserClears';
import ClearEntryModal from './ClearEntryModal';

interface GameClearsProps {
  clearEntries: ClearEntry[];
  isViewOnly?: boolean;
}

const GameClears: React.FC<GameClearsProps> = ({ clearEntries, isViewOnly = false }) => {
  const [selectedGame, setSelectedGame] = useState<TouhouGame | null>(null);
  const [entryToEdit, setEntryToEdit] = useState<ClearEntry | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-200 mb-4">Select a game to view clears</h3>
        <GameCoverGrid onGameSelect={handleGameSelect} selectedGame={selectedGame} />
      </div>

      {selectedGame && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            Clears for {selectedGame.toUpperCase()}
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

export default GameClears;
