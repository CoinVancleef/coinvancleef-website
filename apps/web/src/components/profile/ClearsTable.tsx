import React from 'react';
import {
  TouhouGame,
  GAME_COVER_IMAGES,
  GAME_DISPLAY_NAMES,
  GAME_THIRD_CONDITION,
} from '../../touhou-types/enums';
import { getGameName } from '../../utils/formatters';

export interface ClearEntry {
  public_uuid: string;
  game: string;
  shotType: string;
  difficulty?: string;
  achievementType?: string;
  danmaku_points: number;
  isNoDeaths: boolean;
  isNoBombs: boolean;
  isNo3rdCondition: boolean;
  numberOfDeaths?: number | null;
  numberOfBombs?: number | null;
  videoLink?: string | null;
  replayLink?: string | null;
  dateAchieved?: string | null;
  createdAt: string;
}

interface ClearsTableProps {
  clearEntries: ClearEntry[];
  showIndex?: boolean;
  onEdit?: (entry: ClearEntry) => void;
  isOwnProfile?: boolean;
}

const ClearsTable: React.FC<ClearsTableProps> = ({
  clearEntries,
  showIndex = true,
  onEdit,
  isOwnProfile = false,
}) => {
  // Get conditions as a string (NB = No Bombs, NM = No Miss, NT = No Third Condition)
  const getConditionString = (clearEntry: ClearEntry) => {
    const conditions = [];
    if (clearEntry.isNoDeaths) conditions.push('NM');
    if (clearEntry.isNoBombs) conditions.push('NB');
    if (clearEntry.isNo3rdCondition) {
      const thirdCondition = GAME_THIRD_CONDITION[clearEntry.game as TouhouGame];
      conditions.push(thirdCondition?.code || '');
    }

    // Special case for WBaWC: Add NHB (No Hyper Breaks) if all three conditions are met
    if (
      clearEntry.game === TouhouGame.TH17 &&
      clearEntry.isNoDeaths &&
      clearEntry.isNoBombs &&
      clearEntry.isNo3rdCondition
    ) {
      conditions.push('NHB');
    }

    return conditions.length > 0 ? conditions.join(', ') : 'None';
  };

  // Check if a clear has a video or replay link
  const hasLinks = (clearEntry: ClearEntry) => clearEntry.videoLink || clearEntry.replayLink;

  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700">
        <tr>
          {showIndex && (
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-10"
            >
              #
            </th>
          )}
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Game
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Difficulty
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Shot
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Deaths
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Bombs
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Conditions
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            DP
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
          >
            Links
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {clearEntries.map((clearEntry, index) => (
          <tr
            key={clearEntry.public_uuid}
            className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} group relative`}
          >
            {showIndex && (
              <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-gray-300">
                {index + 1}
              </td>
            )}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              <div className="flex items-center">
                <img
                  src={GAME_COVER_IMAGES[clearEntry.game as TouhouGame]}
                  alt={getGameName(clearEntry.game as TouhouGame)}
                  className="h-6 w-auto mr-2 rounded"
                />
                <span>{GAME_DISPLAY_NAMES[clearEntry.game as TouhouGame]}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Lunatic</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {clearEntry.shotType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {clearEntry.isNoDeaths ? '0' : clearEntry.numberOfDeaths || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {clearEntry.isNoBombs ? '0' : clearEntry.numberOfBombs || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {getConditionString(clearEntry)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
              {clearEntry.danmaku_points.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm pr-8">
              {hasLinks(clearEntry) ? (
                <div className="flex flex-col space-y-1">
                  {clearEntry.videoLink && (
                    <a
                      href={clearEntry.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      Video
                    </a>
                  )}
                  {clearEntry.replayLink && (
                    <a
                      href={clearEntry.replayLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      Replay
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </td>
            {isOwnProfile && onEdit && (
              <button
                onClick={() => onEdit(clearEntry)}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-400 transition-opacity duration-200 focus:outline-none"
                title="Edit clear entry"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClearsTable;
