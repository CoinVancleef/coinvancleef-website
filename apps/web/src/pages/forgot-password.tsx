import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

// Cooldown time in seconds
const COOLDOWN_TIME = 60;

// Store last request time in localStorage to persist across page refreshes
const getLastRequestTime = () => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem('lastPasswordResetRequest');
  return stored ? parseInt(stored, 10) : 0;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Rate limiting state
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(getLastRequestTime);

  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  // Check for existing cooldown on component mount
  useEffect(() => {
    const storedTime = getLastRequestTime();
    if (storedTime) {
      const elapsedTime = Math.floor((Date.now() - storedTime) / 1000);
      const remaining = Math.max(0, COOLDOWN_TIME - elapsedTime);

      if (remaining > 0) {
        setIsInCooldown(true);
        setLastRequestTime(storedTime);
        setCooldownRemaining(remaining);
      }
    }
  }, []);

  // Handle cooldown timer
  useEffect(() => {
    if (!isInCooldown) return;

    const intervalId = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - lastRequestTime) / 1000);
      const remaining = Math.max(0, COOLDOWN_TIME - elapsedTime);

      setCooldownRemaining(remaining);

      if (remaining === 0) {
        setIsInCooldown(false);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isInCooldown, lastRequestTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for cooldown period
    if (isInCooldown) {
      setErrorMessage(`Please wait ${cooldownRemaining} seconds before requesting another email.`);
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    try {
      // Start cooldown immediately (even before API call completes)
      const currentTime = Date.now();
      setIsInCooldown(true);
      setLastRequestTime(currentTime);
      setCooldownRemaining(COOLDOWN_TIME);

      // Store in localStorage to persist across page refreshes
      localStorage.setItem('lastPasswordResetRequest', currentTime.toString());

      const { data } = await requestReset({
        variables: { email },
      });

      if (data.requestPasswordReset.errors?.length) {
        // Process field-specific errors
        const newFieldErrors: { [key: string]: string } = {};
        let generalError = '';

        data.requestPasswordReset.errors.forEach((err: any) => {
          if (err.field === 'email') {
            newFieldErrors.email = err.message;
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

      if (data.requestPasswordReset.success) {
        setSuccessMessage(
          data.requestPasswordReset.message ||
            'Password reset email sent. Please check your inbox.',
        );
        setEmail(''); // Clear the form
      } else {
        setErrorMessage(
          data.requestPasswordReset.message || 'An error occurred. Please try again.',
        );
      }
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(
        error.message && error.message.includes('GraphQL error')
          ? error.message.replace('GraphQL error: ', '')
          : error.message || 'An error occurred while requesting password reset',
      );
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | CoinVancleef</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-700 -m-8 mb-6 p-8 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center text-white">Reset Password</h1>
          </div>

          {errorMessage && (
            <div className="bg-red-900/50 border-l-4 border-red-500 text-white px-4 py-3 rounded mb-6">
              <p className="font-bold">Error</p>
              <p>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-900/50 border-l-4 border-green-500 text-white px-4 py-3 rounded mb-6">
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
            </div>
          )}

          {isInCooldown && cooldownRemaining > 0 && !errorMessage && (
            <div className="bg-blue-900/50 border-l-4 border-blue-500 text-white px-4 py-3 rounded mb-6">
              <p className="font-bold">Rate Limited</p>
              <p>Please wait {cooldownRemaining} seconds before requesting another email.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
              )}
              <p className="mt-1 text-sm text-gray-400">
                Enter the email address associated with your account, and we'll send you a link to
                reset your password.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || isInCooldown}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading
                  ? 'Sending...'
                  : isInCooldown
                  ? `Try again in ${cooldownRemaining}s`
                  : 'Send Reset Link'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
