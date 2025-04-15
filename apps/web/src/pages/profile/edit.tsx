import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';

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
        name
        twitterHandle
        youtubeChannel
        twitchChannel
        discord
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
  const [name, setName] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [twitchChannel, setTwitchChannel] = useState('');
  const [discord, setDiscord] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }

    // Debug: log token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Current token available:', !!token);
      console.log('Auth user available:', !!authUser);
    }
  }, [authLoading, isAuthenticated, router, authUser]);

  // Get user profile data
  const { data, loading } = useQuery(GET_USER_PROFILE, {
    variables: { publicUuid: authUser?.public_uuid || '' },
    skip: !authUser?.public_uuid,
    onCompleted: data => {
      if (data?.user) {
        // Initialize form with current user data
        setName(data.user.name || '');
        setTwitterHandle(data.user.twitterHandle || '');
        setYoutubeChannel(data.user.youtubeChannel || '');
        setTwitchChannel(data.user.twitchChannel || '');
        setDiscord(data.user.discord || '');
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
            name,
            twitterHandle: twitterHandle || null,
            youtubeChannel: youtubeChannel || null,
            twitchChannel: twitchChannel || null,
            discord: discord || null,
          },
        },
      });

      if (data.updateProfile.errors?.length) {
        // Process field-specific errors
        const newFieldErrors: { [key: string]: string } = {};
        let generalError = '';

        data.updateProfile.errors.forEach((err: any) => {
          if (
            ['name', 'twitterHandle', 'youtubeChannel', 'twitchChannel', 'discord'].includes(
              err.field,
            )
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Profile | Coinvancleef</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6">
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            </div>

            <div className="p-6">
              {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p className="font-bold">Error</p>
                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                  <p className="font-bold">Success</p>
                  <p>{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        fieldErrors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900">Social Media</h2>
                  <p className="text-sm text-gray-500">
                    Add your social media handles to connect with other players
                  </p>

                  <div>
                    <label
                      htmlFor="twitterHandle"
                      className="block text-sm font-medium text-gray-700"
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
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          fieldErrors.twitterHandle ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.twitterHandle && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.twitterHandle}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="youtubeChannel"
                      className="block text-sm font-medium text-gray-700"
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
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          fieldErrors.youtubeChannel ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.youtubeChannel && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.youtubeChannel}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="twitchChannel"
                      className="block text-sm font-medium text-gray-700"
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
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          fieldErrors.twitchChannel ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.twitchChannel && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.twitchChannel}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="discord" className="block text-sm font-medium text-gray-700">
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
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          fieldErrors.discord ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.discord && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.discord}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/profile"
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
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
