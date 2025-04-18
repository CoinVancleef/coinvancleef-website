import React from 'react';
import { TouhouGame, GAME_DISPLAY_NAMES, GAME_COVER_IMAGES } from '../touhou-types/enums';

interface GameCoverGridProps {
  onGameSelect: (game: TouhouGame) => void;
  selectedGame?: TouhouGame | null;
}

const GameCoverGrid: React.FC<GameCoverGridProps> = ({ onGameSelect, selectedGame }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
        {Object.values(TouhouGame).map(game => (
          <div
            key={game}
            className={`relative cursor-pointer transition-all duration-200 transform hover:scale-105 rounded-lg overflow-hidden shadow-md ${
              selectedGame === game ? 'ring-4 ring-indigo-500' : ''
            }`}
            onClick={() => onGameSelect(game)}
          >
            <div className="aspect-square relative">
              <img
                src={GAME_COVER_IMAGES[game]}
                alt={GAME_DISPLAY_NAMES[game]}
                className="w-full h-full object-cover absolute inset-0 filter blur-[0.4px]"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <span className="text-xs text-white font-medium truncate block">
                  {GAME_DISPLAY_NAMES[game]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCoverGrid;
