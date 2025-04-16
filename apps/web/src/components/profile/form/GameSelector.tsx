import React, { useState, useRef, useEffect } from 'react';
import {
  TouhouGame,
  GAME_DISPLAY_NAMES,
  GAME_COVER_IMAGES,
  GAME_SHORT_NAMES,
} from '../../../touhou-types/enums';

interface GameSelectorProps {
  game: string;
  setGame: (game: string) => void;
  error?: string;
}

const GameSelector: React.FC<GameSelectorProps> = ({ game, setGame, error }) => {
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGameDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-1">
        Game
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className={`flex items-center justify-between w-full px-3 py-2 rounded bg-gray-700 border ${
            error ? 'border-red-500' : 'border-gray-600'
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
        >
          {game ? (
            <div className="flex items-center">
              <img
                src={GAME_COVER_IMAGES[game as TouhouGame]}
                alt={GAME_DISPLAY_NAMES[game as TouhouGame]}
                className="h-6 w-auto mr-2 rounded"
              />
              <span>{GAME_SHORT_NAMES[game as TouhouGame]}</span>
            </div>
          ) : (
            <span>Select Game</span>
          )}
          <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {isGameDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {Object.entries(TouhouGame).map(([_, value]) => (
                <li
                  key={value}
                  className="cursor-pointer hover:bg-gray-600 px-3 py-2"
                  onClick={() => {
                    setGame(value);
                    setIsGameDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <img
                      src={GAME_COVER_IMAGES[value as TouhouGame]}
                      alt={GAME_DISPLAY_NAMES[value as TouhouGame]}
                      className="h-6 w-auto mr-2 rounded"
                    />
                    <span className="text-white">{GAME_DISPLAY_NAMES[value as TouhouGame]}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default GameSelector;
