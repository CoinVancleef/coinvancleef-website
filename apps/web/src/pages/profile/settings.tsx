import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

// Query to get current user data
const GET_USER_PROFILE = gql`
  query GetUserProfile($publicUuid: String!) {
    user(publicUuid: $publicUuid) {
      public_uuid
      email
      name
    }
  }
`;

// Mutation to update user profile
const UPDATE_ACCOUNT = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      user {
        public_uuid
        name
        email
      }
      errors {
        field
        message
      }
    }
  }
`;

// Mutation to change password
const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();

  // Form state for account info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Form state for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [accountErrorMessage, setAccountErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [accountFieldErrors, setAccountFieldErrors] = useState<{ [key: string]: string }>({});
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<{ [key: string]: string }>({});
  const [accountSuccessMessage, setAccountSuccessMessage] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');

  // Validate name - only allow English letters, numbers, spaces, and basic punctuation
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z0-9 \-'_.]+$/;
    return nameRegex.test(name);
  };

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
        setName(data.user.name || '');

        // Only set email if it's not a placeholder
        const userEmail = data.user.email || '';
        if (!userEmail.includes('@placeholder.com')) {
          setEmail(userEmail);
        } else {
          setEmail(''); // Clear email field for placeholder emails
        }
      }
    },
  });

  // Update account mutation
  const [updateAccount, { loading: updatingAccount }] = useMutation(UPDATE_ACCOUNT);

  // Change password mutation
  const [changePassword, { loading: changingPassword }] = useMutation(CHANGE_PASSWORD);

  // Handle name input with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    // Clear error if field is now valid
    if (validateName(value) && accountFieldErrors.name) {
      const newErrors = { ...accountFieldErrors };
      delete newErrors.name;
      setAccountFieldErrors(newErrors);
    }
  };

  // Handle account form submission
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountErrorMessage('');
    setAccountFieldErrors({});
    setAccountSuccessMessage('');

    // Validate name
    if (name && !validateName(name)) {
      setAccountFieldErrors({
        name: 'Name can only contain English letters, numbers, and basic punctuation',
      });
      return;
    }

    try {
      const { data } = await updateAccount({
        variables: {
          data: {
            name,
            email,
          },
        },
      });

      if (data.updateProfile.errors?.length) {
        // Process field-specific errors
        const newFieldErrors: { [key: string]: string } = {};
        let generalError = '';

        data.updateProfile.errors.forEach((err: any) => {
          if (['name', 'email'].includes(err.field)) {
            newFieldErrors[err.field] = err.message;
          } else {
            generalError += (generalError ? ', ' : '') + err.message;
          }
        });

        setAccountFieldErrors(newFieldErrors);
        if (generalError) {
          setAccountErrorMessage(generalError);
        }
        return;
      }

      if (data.updateProfile.user) {
        setAccountSuccessMessage('Account information updated successfully!');
      }
    } catch (error: any) {
      console.error('Update account error:', error);
      setAccountErrorMessage(error.message || 'An error occurred while updating your account');
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMessage('');
    setPasswordFieldErrors({});
    setPasswordSuccessMessage('');

    // Client-side validation
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordFieldErrors(newErrors);
      return;
    }

    try {
      const { data } = await changePassword({
        variables: {
          currentPassword,
          newPassword,
        },
      });

      if (!data.changePassword.success) {
        if (data.changePassword.errors?.length) {
          // Process field-specific errors
          const serverErrors: { [key: string]: string } = {};

          data.changePassword.errors.forEach((err: any) => {
            if (['currentPassword', 'newPassword'].includes(err.field)) {
              serverErrors[err.field] = err.message;
            } else {
              setPasswordErrorMessage(err.message);
            }
          });

          setPasswordFieldErrors(serverErrors);
        } else {
          setPasswordErrorMessage(data.changePassword.message || 'Failed to change password');
        }
        return;
      }

      // Success
      setPasswordSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Change password error:', error);
      setPasswordErrorMessage(error.message || 'An error occurred while changing your password');
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
        <title>Account Settings</title>
      </Head>
      <main className="min-h-screen bg-gray-900 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-800 to-purple-700 px-6 py-6">
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            </div>

            <div className="p-6 space-y-8">
              {/* Account Information Form */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>

                {accountErrorMessage && (
                  <div className="bg-red-900/50 border-l-4 border-red-500 text-white p-4 mb-6">
                    <p className="font-bold">Error</p>
                    <p>{accountErrorMessage}</p>
                  </div>
                )}

                {accountSuccessMessage && (
                  <div className="bg-green-900/50 border-l-4 border-green-500 text-white p-4 mb-6">
                    <p className="font-bold">Success</p>
                    <p>{accountSuccessMessage}</p>
                  </div>
                )}

                <form onSubmit={handleAccountSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          accountFieldErrors.name ? 'border-red-500' : ''
                        }`}
                      />
                      {accountFieldErrors.name && (
                        <p className="mt-1 text-sm text-red-400">{accountFieldErrors.name}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          accountFieldErrors.email ? 'border-red-500' : ''
                        }`}
                      />
                      {accountFieldErrors.email && (
                        <p className="mt-1 text-sm text-red-400">{accountFieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updatingAccount}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {updatingAccount ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="border-t border-gray-700 my-8"></div>

              {/* Change Password Form */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>

                {passwordErrorMessage && (
                  <div className="bg-red-900/50 border-l-4 border-red-500 text-white p-4 mb-6">
                    <p className="font-bold">Error</p>
                    <p>{passwordErrorMessage}</p>
                  </div>
                )}

                {passwordSuccessMessage && (
                  <div className="bg-green-900/50 border-l-4 border-green-500 text-white p-4 mb-6">
                    <p className="font-bold">Success</p>
                    <p>{passwordSuccessMessage}</p>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Current Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          passwordFieldErrors.currentPassword ? 'border-red-500' : ''
                        }`}
                      />
                      {passwordFieldErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-400">
                          {passwordFieldErrors.currentPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-300"
                    >
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          passwordFieldErrors.newPassword ? 'border-red-500' : ''
                        }`}
                      />
                      {passwordFieldErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-400">
                          {passwordFieldErrors.newPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-600 rounded-md text-white ${
                          passwordFieldErrors.confirmPassword ? 'border-red-500' : ''
                        }`}
                      />
                      {passwordFieldErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-400">
                          {passwordFieldErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {changingPassword ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Back to profile link */}
              <div className="pt-4 border-t border-gray-700">
                <Link href="/profile" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  ← Back to Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
