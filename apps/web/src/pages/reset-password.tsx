import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import EyeIcon from 'src/components/icons/eye-icon';
import EyeSlashIcon from 'src/components/icons/eye-slash-icon';

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  // Check if token is present in the URL
  useEffect(() => {
    if (router.isReady && !token) {
      setInvalidToken(true);
      setErrorMessage('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    // Validate password fields
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Client-side password validation - matches server-side rules
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8) {
      setFieldErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      setFieldErrors({
        password:
          'Password must include at least one uppercase letter, one lowercase letter, and one number',
      });
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: {
          token: token as string,
          newPassword: password,
        },
      });

      if (data.resetPassword.errors?.length) {
        // Process field-specific errors
        const newFieldErrors: { [key: string]: string } = {};
        let generalError = '';

        data.resetPassword.errors.forEach((err: any) => {
          if (err.field === 'password' || err.field === 'newPassword') {
            newFieldErrors.password = err.message;
          } else if (err.field === 'token') {
            setInvalidToken(true);
            generalError += (generalError ? ', ' : '') + err.message;
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

      if (data.resetPassword.success) {
        setSuccessMessage(
          data.resetPassword.message || 'Your password has been successfully reset.',
        );
        // Clear the form
        setPassword('');
        setConfirmPassword('');

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setErrorMessage(data.resetPassword.message || 'An error occurred. Please try again.');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(
        error.message && error.message.includes('GraphQL error')
          ? error.message.replace('GraphQL error: ', '')
          : error.message || 'An error occurred while resetting your password',
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Head>
        <title>Reset Password | CoinVancleef</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-700 -m-8 mb-6 p-8 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center text-white">Reset Your Password</h1>
          </div>

          {errorMessage && (
            <div className="bg-red-900/50 border-l-4 border-red-500 text-white px-4 py-3 rounded mb-6">
              <p className="font-bold">Error</p>
              <p>{errorMessage}</p>
              {invalidToken && (
                <div className="mt-2">
                  <Link
                    href="/forgot-password"
                    className="text-indigo-300 hover:text-indigo-200 underline"
                  >
                    Request a new reset link
                  </Link>
                </div>
              )}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-900/50 border-l-4 border-green-500 text-white px-4 py-3 rounded mb-6">
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
              <p className="mt-2 text-sm">Redirecting to login page...</p>
            </div>
          )}

          {!invalidToken && !successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-700 border ${
                      fieldErrors.password ? 'border-red-500' : 'border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  Password must be at least 8 characters and include uppercase letters, lowercase
                  letters, and numbers.
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-700 border ${
                      fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

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
