import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileHeader from '../components/profile/ProfileHeader';
import SocialLinks from '../components/profile/SocialLinks';
import LogoutButton from '../components/profile/LogoutButton';
import RecentClears from '../components/profile/RecentClears';
import ClearEntries from '../components/profile/ClearEntries';

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
  const { user, loading: authLoading, isAuthenticated } = useAuth();

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
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  // Use the query data if available, otherwise use the stored user data
  const userData = data?.user || user;

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
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-md mb-8 w-full">
              <ProfileHeader name={userData.name} danmakuPoints={userData.danmaku_points} />

              <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
                  Social Links
                </h2>
                <SocialLinks
                  discordTag={userData.discord}
                  twitterUrl={
                    userData.twitterHandle
                      ? `https://twitter.com/${userData.twitterHandle}`
                      : undefined
                  }
                  twitchUrl={
                    userData.twitchChannel
                      ? `https://twitch.tv/${userData.twitchChannel}`
                      : undefined
                  }
                  youtubeUrl={
                    userData.youtubeChannel
                      ? `https://youtube.com/${userData.youtubeChannel}`
                      : undefined
                  }
                />
              </div>

              <div className="text-center">
                <LogoutButton />
              </div>
            </div>

            <RecentClears />
            <ClearEntries />

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
