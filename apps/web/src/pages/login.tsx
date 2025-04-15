import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';

const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        public_uuid
        email
        name
        role
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

  return (
    <>
      <Head>
        <title>Login | Coinvancleef</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
