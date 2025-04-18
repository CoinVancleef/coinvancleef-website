import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileHeader from '../components/profile/ProfileHeader';
import SocialLinks from '../components/profile/SocialLinks';
import RecentClears from '../components/profile/RecentClears';
import ClearEntries from '../components/profile/ClearEntries';
import GameCoverSection from '../components/profile/GameCoverSection';

const GET_USER_PROFILE = gql`
  query GetUserProfile($publicUuid: String!) {
    user(publicUuid: $publicUuid) {
      public_uuid
      email
      name
      role
      danmaku_points
      totalClears
      lnn
      lnb
      l1cc
      globalRank
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
  const { uuid } = router.query;
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  // Determine if viewing own profile or someone else's
  useEffect(() => {
    if (uuid && user) {
      setIsOwnProfile(uuid === user.public_uuid);
    } else {
      setIsOwnProfile(true);
    }
  }, [uuid, user]);

  // Redirect if not authenticated and trying to view own profile
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !uuid) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router, uuid]);

  // Get profile UUID to query
  const profileUuid = uuid || user?.public_uuid || '';

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { publicUuid: profileUuid },
    skip: !profileUuid, // Skip query if no UUID available
  });

  // Show loading state while checking auth or fetching data
  if (authLoading || loading || (!user && !uuid)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  // Handle not found or error
  if (error || !data?.user) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-200">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
              <p>Error loading profile: {error?.message || 'User not found'}</p>
              <div className="mt-4">
                <Link href="/leaderboard" className="text-indigo-400 hover:text-indigo-300">
                  ← Back to Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use the query data
  const userData = data.user;

  return (
    <>
      <Head>
        <title>{userData.name ? `${userData.name}'s Profile` : 'Profile'}</title>
      </Head>
      <div className="bg-gray-900 min-h-screen text-gray-200">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-md mb-8 w-full overflow-hidden">
              <ProfileHeader
                name={userData.name}
                danmakuPoints={userData.danmaku_points}
                totalClears={userData.totalClears}
                lnn={userData.lnn}
                lnb={userData.lnb}
                l1cc={userData.l1cc}
                globalRank={userData.globalRank}
                isOwnProfile={isOwnProfile}
              />

              <div className="p-6 mb-6">
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
            </div>

            <RecentClears profileUuid={userData.public_uuid} isViewOnly={!isOwnProfile} />
            <ClearEntries profileUuid={userData.public_uuid} isViewOnly={!isOwnProfile} />
            <GameCoverSection profileUuid={userData.public_uuid} isViewOnly={!isOwnProfile} />

            <div className="text-center mt-8">
              {isOwnProfile ? (
                <></>
              ) : (
                <Link
                  href="/leaderboard"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  ← Back to Leaderboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
