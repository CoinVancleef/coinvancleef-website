import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import EyeIcon from 'src/components/icons/eye-icon';
import EyeSlashIcon from 'src/components/icons/eye-slash-icon';

const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        public_uuid
        email
        name
        role
        profilePicture
      }
      token
      errors {
        field
        message
      }
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    try {
      const { data } = await login({
        variables: {
          data: {
            email,
            password,
          },
        },
      });

      if (data.login.errors?.length) {
        // Process field-specific errors
        const newFieldErrors: { [key: string]: string } = {};
        let generalError = '';

        data.login.errors.forEach((err: any) => {
          if (['email', 'password'].includes(err.field)) {
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

      if (data.login.token) {
        // Use auth context to handle login
        authLogin(data.login.token, data.login.user);

        // Redirect to user profile
        router.push('/profile');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(
        error.message && error.message.includes('GraphQL error')
          ? error.message.replace('GraphQL error: ', '')
          : error.message || 'An error occurred during login',
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head>
        <title>Login | CoinVancleef</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-700 -m-8 mb-6 p-8 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center text-white">Sign In</h1>
          </div>

          {errorMessage && (
            <div className="bg-red-900/50 border-l-4 border-red-500 text-white px-4 py-3 rounded mb-4">
              {errorMessage}
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
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
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
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
              )}
              <div className="mt-1 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
