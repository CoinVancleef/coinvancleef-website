import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGameName, formatShotType, formatScore, formatDate } from '../utils/formatters';
import { TouhouGame } from '../touhou-types/enums';

const GET_USER_PROFILE = gql`
  query GetUserProfile($publicUuid: String!) {
    user(publicUuid: $publicUuid) {
      public_uuid
      email
      name
      role
      danmaku_points
      twitterHandle
      youtubeChannel
      twitchChannel
      discord
      createdAt
    }
  }
`;

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { publicUuid: user?.public_uuid || '' },
    skip: !user?.public_uuid, // Skip query if user public_uuid is not available
  });

  // Show loading state while checking auth or fetching data
  if (authLoading || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Use the query data if available, otherwise use the stored user data
  const userData = data?.user || user;

  const formatSocialLink = (account: string, value: string) => {
    if (!value) return null;

    let url = '';
    let svg = null;

    if (account === 'twitter') {
      url = `https://twitter.com/${value}`;
      svg = (
        <svg
          className="w-5 h-5 text-blue-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      );
    } else if (account === 'youtube') {
      url = `https://youtube.com/${value}`;
      svg = (
        <svg
          className="w-5 h-5 text-red-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      );
    } else if (account === 'twitch') {
      url = `https://twitch.tv/${value}`;
      svg = (
        <svg
          className="w-5 h-5 text-purple-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
        </svg>
      );
    } else if (account === 'discord') {
      url = value;
      svg = (
        <svg
          className="w-5 h-5 text-indigo-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6935-.2762-5.4996 0-.1634-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4 mb-2 inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-200 hover:text-white"
      >
        {svg}
        <span className="ml-2">{value}</span>
      </a>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto py-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg shadow">
            <p>Error loading profile: {error.message}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-md mb-8">
              <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900 -mt-8 -mx-8 p-8 mb-6 rounded-t-lg">
                <h1 className="text-3xl font-bold text-center text-white mb-2">{userData.name}</h1>
                <p className="text-center text-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-yellow-400 mr-2"
                  >
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                  </svg>
                  <span className="font-bold mr-2">{userData.danmaku_points}</span> Danmaku Points
                </p>
              </div>

              {/* Social Links */}
              <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
                  Social Links
                </h2>
                <div className="flex flex-wrap">
                  {formatSocialLink('twitter', userData.twitterHandle)}
                  {formatSocialLink('youtube', userData.youtubeChannel)}
                  {formatSocialLink('twitch', userData.twitchChannel)}
                  {formatSocialLink('discord', userData.discord)}
                </div>
              </div>

              {/* Recent Scores */}
              <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
                  Recent Scores
                </h2>
                {userData.scores && userData.scores.length > 0 ? (
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
                        {userData.scores.map((score, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {getGameName(score.game)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatShotType(score.game, score.shotType)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatScore(score.score)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatDate(score.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400">No scores submitted yet.</p>
                )}
              </div>

              {/* Logout Button */}
              <div className="text-center">
                <button
                  onClick={logout}
                  className="inline-flex items-center px-6 py-3 border border-indigo-500 rounded-lg shadow-sm text-base font-medium text-indigo-300 bg-gray-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Clear Entries Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Your Clear Entries</h2>
                <Link
                  href="/clear-entries/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-indigo-400 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200"
                >
                  Add New Clear
                </Link>
              </div>

              <div className="text-center py-8 text-gray-400">
                <p>Your clear entries will appear here</p>
                <p className="mt-2">
                  <Link
                    href="/games"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Browse games
                  </Link>
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
