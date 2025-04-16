import React from 'react';
import { getGameName, formatShotType, formatScore, formatDate } from '../../utils/formatters';
import { TouhouGame } from '../../touhou-types/enums';

interface Clear {
  game: string;
  shotType: string;
  score: number;
  date: string;
}

interface RecentClearsProps {
  clears?: Clear[];
}

const RecentClears: React.FC<RecentClearsProps> = ({ clears = [] }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
        Recent Clears
      </h2>
      {clears && clears.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
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
                  Character
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {clears.map((clear, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getGameName(clear.game as TouhouGame)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatShotType(clear.game as TouhouGame, clear.shotType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatScore(clear.score)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(clear.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No clears submitted yet.</p>
      )}
    </div>
  );
};

export default RecentClears;
