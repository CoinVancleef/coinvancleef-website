import React from 'react';
import { Difficulty } from '../../../touhou-types/enums';

interface DifficultySelectorProps {
  difficulty: string;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty }) => {
  return (
    <div>
      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
        Difficulty
      </label>
      <select
        id="difficulty"
        className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 opacity-80 cursor-not-allowed"
        value={difficulty}
        disabled={true}
      >
        <option value={Difficulty.LUNATIC}>{Difficulty.LUNATIC}</option>
        {Object.values(Difficulty)
          .filter(diff => diff !== Difficulty.LUNATIC)
          .map(diff => (
            <option key={diff} value={diff} disabled>
              {diff}
            </option>
          ))}
      </select>
      <p className="mt-1 text-sm text-indigo-400 flex items-center">
        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
            clipRule="evenodd"
          />
        </svg>
        <span>We only support Lunatic difficulty currently.</span>
      </p>
    </div>
  );
};

export default DifficultySelector;
