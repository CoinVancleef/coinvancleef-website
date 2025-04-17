import React from 'react';
import { TouhouGame } from '../../../touhou-types/enums';
import {
  GAME_SHOT_TYPE_MAP,
  TH08ShotTypeA,
  TH08ShotTypeB,
} from '../../../touhou-types/shotTypeEnums';

interface ShotTypeSelectorProps {
  game: string;
  shotType: string;
  setShotType: (shotType: string) => void;
  error?: string;
  disabled?: boolean;
}

const ShotTypeSelector: React.FC<ShotTypeSelectorProps> = ({
  game,
  shotType,
  setShotType,
  error,
  disabled,
}) => {
  return (
    <div>
      <label htmlFor="shotType" className="block text-sm font-medium text-gray-300 mb-1">
        Shot Type
      </label>
      <select
        id="shotType"
        className={`w-full px-3 py-2 rounded bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-600'
        } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          !game || disabled ? 'opacity-80 cursor-not-allowed' : ''
        }`}
        value={shotType}
        onChange={e => setShotType(e.target.value)}
        disabled={!game || disabled}
      >
        <option value="">Select Shot Type</option>

        {/* TH08 needs special handling to show both Final A and Final B */}
        {game === TouhouGame.TH08 ? (
          <>
            {/* Final A shot types */}
            <optgroup label="Final A">
              {Object.entries(TH08ShotTypeA).map(([key, value]) => (
                <option key={value as string} value={value as string}>
                  {value as string}
                </option>
              ))}
            </optgroup>

            {/* Final B shot types */}
            <optgroup label="Final B">
              {Object.entries(TH08ShotTypeB).map(([key, value]) => (
                <option key={value as string} value={value as string}>
                  {value as string}
                </option>
              ))}
            </optgroup>
          </>
        ) : (
          /* Other games use the standard map */
          game &&
          Object.entries(GAME_SHOT_TYPE_MAP[game as TouhouGame] || {})
            .filter(([_, value]) => typeof value === 'string')
            .map(([key, value]) => (
              <option key={value as string} value={value as string}>
                {value as string}
              </option>
            ))
        )}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ShotTypeSelector;
