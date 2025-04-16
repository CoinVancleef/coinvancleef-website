import React from 'react';
import { TouhouGame } from '../../../touhou-types/enums';

interface CountInputsProps {
  numberOfDeaths: string;
  setNumberOfDeaths: (value: string) => void;
  numberOfBombs: string;
  setNumberOfBombs: (value: string) => void;
  isNoDeaths: boolean;
  isNoBombs: boolean;
  deathsError?: string;
  bombsError?: string;
  selectedGame?: TouhouGame | null;
}

const CountInputs: React.FC<CountInputsProps> = ({
  numberOfDeaths,
  setNumberOfDeaths,
  numberOfBombs,
  setNumberOfBombs,
  isNoDeaths,
  isNoBombs,
  deathsError,
  bombsError,
  selectedGame,
}) => {
  const getDeathCountNote = () => {
    if (!selectedGame) return null;

    switch (selectedGame) {
      case TouhouGame.TH07:
        return (
          <p className="mt-1 text-sm text-indigo-400">
            Note: Border Breaks must be counted as deaths.
          </p>
        );
      case TouhouGame.TH08:
        return (
          <p className="mt-1 text-sm text-indigo-400">
            Note: Failed Last Spells must be counted as deaths.
          </p>
        );
      case TouhouGame.TH17:
        return (
          <p className="mt-1 text-sm text-indigo-400">
            Note: Hyper Breaks must be counted as deaths.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="numberOfDeaths" className="block text-sm font-medium text-gray-300 mb-1">
          Number of Deaths (optional)
        </label>
        <input
          type="number"
          id="numberOfDeaths"
          className={`w-full px-3 py-2 rounded bg-gray-700 border ${
            deathsError ? 'border-red-500' : 'border-gray-600'
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          value={numberOfDeaths}
          onChange={e => setNumberOfDeaths(e.target.value)}
          min="0"
          placeholder="Enter number"
          disabled={isNoDeaths}
        />
        {deathsError && <p className="mt-1 text-sm text-red-500">{deathsError}</p>}
        {getDeathCountNote()}
      </div>

      <div>
        <label htmlFor="numberOfBombs" className="block text-sm font-medium text-gray-300 mb-1">
          Number of Bombs (optional)
        </label>
        <input
          type="number"
          id="numberOfBombs"
          className={`w-full px-3 py-2 rounded bg-gray-700 border ${
            bombsError ? 'border-red-500' : 'border-gray-600'
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          value={numberOfBombs}
          onChange={e => setNumberOfBombs(e.target.value)}
          min="0"
          placeholder="Enter number"
          disabled={isNoBombs}
        />
        {bombsError && <p className="mt-1 text-sm text-red-500">{bombsError}</p>}
      </div>
    </div>
  );
};

export default CountInputs;
