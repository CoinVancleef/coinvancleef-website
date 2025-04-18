import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfilePlaceholderIcon from '../components/icons/ProfilePlaceholderIcon';
import { PROFILE_ICON_URLS, ProfileIcon } from '../touhou-types';

const GET_LEADERBOARD = gql`
  query GetLeaderboard {
    leaderboard {
      public_uuid
      name
      danmaku_points
      totalClears
      lnn
      lnb
      l1cc
      globalRank
      profilePicture
    }
  }
`;

const PLAYERS_PER_PAGE = 50;

export default function LeaderboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const [isChangingPage, setIsChangingPage] = useState(false);

  const { data, loading, error } = useQuery(GET_LEADERBOARD);

  // Process all players data when it's loaded
  useEffect(() => {
    if (data?.leaderboard) {
      // Filter out players with 0 DP and sort by DP
      const filtered = data.leaderboard
        .filter(user => user.danmaku_points > 0)
        .sort((a, b) => b.danmaku_points - a.danmaku_points);

      setFilteredPlayers(filtered);
      setTotalPages(Math.ceil(filtered.length / PLAYERS_PER_PAGE));
    }
  }, [data]);

  // Update displayed players when page changes or data changes
  useEffect(() => {
    if (filteredPlayers.length > 0) {
      const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
      const endIndex = startIndex + PLAYERS_PER_PAGE;
      setDisplayedPlayers(filteredPlayers.slice(startIndex, endIndex));
      setIsChangingPage(false);
    }
  }, [filteredPlayers, currentPage]);

  // Handle page changes
  const goToPage = page => {
    if (page < 1 || page > totalPages || isChangingPage) return;
    setIsChangingPage(true);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Leaderboard</h1>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
              <p>Error loading leaderboard: {error.message}</p>
            </div>
          ) : displayedPlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No players with rankings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full sm:max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gray-850 text-left border-b border-gray-700">
                    <th className="w-12 px-3 py-2 text-gray-400 font-semibold text-sm">#</th>
                    <th className="w-1/4 px-3 py-2 text-gray-400 font-semibold text-sm">Name</th>
                    <th className="w-1/6 px-3 py-2 text-gray-400 font-semibold text-sm text-right">
                      Total Clears
                    </th>
                    <th className="w-1/6 px-3 py-2 text-gray-300 font-semibold text-sm text-right">
                      Danmaku Points
                    </th>
                    <th className="w-12 px-3 py-2 text-gray-400 font-semibold text-sm text-center">
                      LNN
                    </th>
                    <th className="w-12 px-3 py-2 text-gray-400 font-semibold text-sm text-center">
                      LNB
                    </th>
                    <th className="w-12 px-3 py-2 text-gray-400 font-semibold text-sm text-center">
                      L1CC
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {displayedPlayers.map((user, index) => {
                    const actualRank = (currentPage - 1) * PLAYERS_PER_PAGE + index + 1;

                    return (
                      <tr
                        key={user.public_uuid}
                        className={
                          index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750 hover:bg-gray-700'
                        }
                      >
                        <td className="px-3 py-2 text-gray-400 font-medium">{actualRank}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 mr-3 bg-gray-700 rounded-md overflow-hidden border border-gray-600">
                              {user.profilePicture ? (
                                <img
                                  src={PROFILE_ICON_URLS[user.profilePicture as ProfileIcon]}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-500">
                                  <ProfilePlaceholderIcon />
                                </div>
                              )}
                            </div>
                            <div className="font-medium text-gray-300 hover:text-gray-100 truncate">
                              <Link href={`/profile/${user.public_uuid}`}>
                                {user.name || 'Anonymous Player'}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-400 text-right">
                          {user.totalClears.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-gray-100 font-semibold text-right">
                          {user.danmaku_points.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-gray-400 text-center">
                          <span className="font-semibold">{user.lnn}</span>
                        </td>
                        <td className="px-3 py-2 text-gray-400 text-center">
                          <span className="font-semibold">{user.lnb}</span>
                        </td>
                        <td className="px-3 py-2 text-gray-400 text-center">
                          <span className="font-semibold">{user.l1cc}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {isChangingPage && (
                <div className="mt-4 text-center">
                  <LoadingSpinner />
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <nav
                    className="inline-flex items-center rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1 || isChangingPage}
                      className={`${
                        currentPage === 1 || isChangingPage
                          ? 'text-gray-500'
                          : 'text-gray-300 hover:bg-gray-700'
                      } px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800`}
                    >
                      First
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1 || isChangingPage}
                      className={`${
                        currentPage === 1 || isChangingPage
                          ? 'text-gray-500'
                          : 'text-gray-300 hover:bg-gray-700'
                      } px-3 py-2 border border-gray-700 bg-gray-800`}
                    >
                      &lt;
                    </button>
                    <div className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-300">
                      {currentPage} / {totalPages}
                    </div>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages || isChangingPage}
                      className={`${
                        currentPage === totalPages || isChangingPage
                          ? 'text-gray-500'
                          : 'text-gray-300 hover:bg-gray-700'
                      } px-3 py-2 border border-gray-700 bg-gray-800`}
                    >
                      &gt;
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages || isChangingPage}
                      className={`${
                        currentPage === totalPages || isChangingPage
                          ? 'text-gray-500'
                          : 'text-gray-300 hover:bg-gray-700'
                      } px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800`}
                    >
                      Last
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
