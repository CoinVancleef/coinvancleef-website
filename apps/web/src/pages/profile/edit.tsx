import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProfileIconSelector from '../../components/profile/ProfileIconSelector';
import { ProfileIcon, PROFILE_ICON_URLS, PROFILE_ICON_NAMES } from '../../touhou-types';

// Query to get current user data
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
      profilePicture
      createdAt
    }
  }
`;

// Mutation to update user profile
const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      user {
        public_uuid
        twitterHandle
        youtubeChannel
        twitchChannel
        discord
        profilePicture
      }
      errors {
        field
        message
      }
    }
  }
`;

export default function EditProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();

  // Form state
  const [twitterHandle, setTwitterHandle] = useState('');
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [twitchChannel, setTwitchChannel] = useState('');
  const [discord, setDiscord] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Get user profile data
  const { data, loading } = useQuery(GET_USER_PROFILE, {
    variables: { publicUuid: authUser?.public_uuid || '' },
    skip: !authUser?.public_uuid,
    onCompleted: data => {
      if (data?.user) {
        // Initialize form with current user data
        setTwitterHandle(data.user.twitterHandle || '');
        setYoutubeChannel(data.user.youtubeChannel || '');
        setTwitchChannel(data.user.twitchChannel || '');
        setDiscord(data.user.discord || '');
        setProfilePicture(data.user.profilePicture || null);
      }
    },
  });

  // Update profile mutation
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});
    setSuccessMessage('');

    try {
      const { data } = await updateProfile({
        variables: {
          data: {
            twitterHandle: twitterHandle || null,
            youtubeChannel: youtubeChannel || null,
            twitchChannel: twitchChannel || null,
            discord: discord || null,
            profilePicture: profilePicture || null,
          },
        },
      });

      if (data.updateProfile.errors?.length) {
        // Process field-specific errors
        const newFieldErrors: { [key: string]: string } = {};
        let generalError = '';

        data.updateProfile.errors.forEach((err: any) => {
          if (
            [
              'twitterHandle',
              'youtubeChannel',
              'twitchChannel',
              'discord',
              'profilePicture',
            ].includes(err.field)
          ) {
            newFieldErrors[err.field] = err.message;
          } else {
            generalError += (generalError ? ', ' : '') + err.message;
          }
        });

        setFieldErrors(newFieldErrors);
        if (generalError) {
          setErrorMessage(generalError);
        }
        return;
      }

      if (data.updateProfile.user) {
        setSuccessMessage('Profile updated successfully!');

        // Optional: Wait a moment and redirect back to profile page
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      setErrorMessage(error.message || 'An error occurred while updating your profile');
    }
  };

  // Show loading state while checking auth or fetching data
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <main className="min-h-screen bg-gray-900 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-800 to-purple-700 px-6 py-6">
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            </div>

            <div className="p-6">
              {errorMessage && (
                <div className="bg-red-900/50 border-l-4 border-red-500 text-white p-4 mb-6">
                  <p className="font-bold">Error</p>
                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-900/50 border-l-4 border-green-500 text-white p-4 mb-6">
                  <p className="font-bold">Success</p>
                  <p>{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-200">Profile Picture</h2>

                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Profile Picture Preview */}
                    <div className="flex justify-center">
                      {profilePicture ? (
                        <div className="w-32 h-32 border-2 border-indigo-500 p-1 bg-gray-700 rounded-md">
                          <img
                            src={PROFILE_ICON_URLS[profilePicture as ProfileIcon]}
                            alt={PROFILE_ICON_NAMES[profilePicture as ProfileIcon]}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 border-2 border-gray-600 rounded-md flex items-center justify-center bg-gray-700">
                          <svg
                            className="h-16 w-16 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Icon Selector */}
                    <div className="flex-1">
                      <ProfileIconSelector
                        selectedIcon={profilePicture}
                        onSelectIcon={icon => setProfilePicture(icon)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-200">Social Media</h2>
                  <p className="text-sm text-gray-400">
                    Add your social media handles to connect with other players
                  </p>

                  <div>
                    <label
                      htmlFor="twitterHandle"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Twitter
                    </label>
                    <div className="mt-1">
                      <input
                        id="twitterHandle"
                        name="twitterHandle"
                        type="text"
                        value={twitterHandle}
                        onChange={e => setTwitterHandle(e.target.value)}
                        placeholder="@username"
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          fieldErrors.twitterHandle ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.twitterHandle && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.twitterHandle}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="youtubeChannel"
                      className="block text-sm font-medium text-gray-300"
                    >
                      YouTube Channel
                    </label>
                    <div className="mt-1">
                      <input
                        id="youtubeChannel"
                        name="youtubeChannel"
                        type="text"
                        value={youtubeChannel}
                        onChange={e => setYoutubeChannel(e.target.value)}
                        placeholder="Channel ID or URL"
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          fieldErrors.youtubeChannel ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.youtubeChannel && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.youtubeChannel}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="twitchChannel"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Twitch Channel
                    </label>
                    <div className="mt-1">
                      <input
                        id="twitchChannel"
                        name="twitchChannel"
                        type="text"
                        value={twitchChannel}
                        onChange={e => setTwitchChannel(e.target.value)}
                        placeholder="username"
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          fieldErrors.twitchChannel ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.twitchChannel && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.twitchChannel}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="discord" className="block text-sm font-medium text-gray-300">
                      Discord
                    </label>
                    <div className="mt-1">
                      <input
                        id="discord"
                        name="discord"
                        type="text"
                        value={discord}
                        onChange={e => setDiscord(e.target.value)}
                        placeholder="username#0000"
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          fieldErrors.discord ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.discord && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.discord}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/profile"
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
