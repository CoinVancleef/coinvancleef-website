import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';

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

  const formatSocialLink = (type, handle) => {
    if (!handle) return null;

    let url = '';
    let icon = null;

    switch (type) {
      case 'twitter':
        url = `https://twitter.com/${handle.replace('@', '')}`;
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="text-blue-500"
          >
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
          </svg>
        );
        break;
      case 'youtube':
        url = handle.includes('http') ? handle : `https://youtube.com/channel/${handle}`;
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="text-red-500"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
        );
        break;
      case 'twitch':
        url = `https://twitch.tv/${handle}`;
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="text-purple-500"
          >
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
        );
        break;
      case 'discord':
        url = '#';
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="text-indigo-500"
          >
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
          </svg>
        );
        break;
      default:
        return null;
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition"
      >
        {icon}
        <span>{handle}</span>
      </a>
    );
  };

  return (
    <>
      <Head>
        <title>My Profile | Coinvancleef</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {userData.name || 'Player Profile'}
                  </h1>
                  <p className="text-blue-100 flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="mr-2 text-yellow-300"
                    >
                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm7 6c-1.65 0-3-1.35-3-3V5h6v6c0 1.65-1.35 3-3 3zm7-6c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                    </svg>
                    <span className="font-bold mr-2">{userData.danmaku_points}</span> Danmaku Points
                  </p>
                </div>
                <div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p className="font-bold">Error</p>
                <p>Could not load profile: {error.message}</p>
              </div>
            )}

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media</h2>
                  <div className="space-y-4">
                    {userData.twitterHandle ||
                    userData.youtubeChannel ||
                    userData.twitchChannel ||
                    userData.discord ? (
                      <>
                        {userData.twitterHandle && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              Twitter
                            </label>
                            <div className="mt-1">
                              {formatSocialLink('twitter', userData.twitterHandle)}
                            </div>
                          </div>
                        )}

                        {userData.youtubeChannel && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              YouTube
                            </label>
                            <div className="mt-1">
                              {formatSocialLink('youtube', userData.youtubeChannel)}
                            </div>
                          </div>
                        )}

                        {userData.twitchChannel && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              Twitch
                            </label>
                            <div className="mt-1">
                              {formatSocialLink('twitch', userData.twitchChannel)}
                            </div>
                          </div>
                        )}

                        {userData.discord && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">
                              Discord
                            </label>
                            <div className="mt-1">
                              {formatSocialLink('discord', userData.discord)}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 italic">No social media accounts linked</p>
                    )}

                    <div className="pt-4">
                      <Link
                        href="/profile/edit"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Entries Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Your Clear Entries</h2>
              <Link
                href="/clear-entries/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New Clear
              </Link>
            </div>

            <div className="text-center py-8 text-gray-500">
              <p>Your clear entries will appear here</p>
              <p className="mt-2">
                <Link href="/games" className="text-indigo-600 hover:text-indigo-500">
                  Browse games
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
