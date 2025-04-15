import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';

const REGISTER_MUTATION = gql`
  mutation Register($data: UserInput!) {
    register(data: $data) {
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

export default function RegisterPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      const { data } = await register({
        variables: {
          data: {
            name,
            email,
            password,
          },
        },
      });

      if (data.register.errors?.length) {
        // Process field-specific errors
        const newFieldErrors: { [key: string]: string } = {};
        let generalError = '';

        data.register.errors.forEach((err: any) => {
          if (['email', 'password', 'name'].includes(err.field)) {
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

      if (data.register.token) {
        // Use auth context to handle login
        authLogin(data.register.token, data.register.user);

        // Redirect to user profile
        router.push('/profile');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(
        error.message && error.message.includes('GraphQL error')
          ? error.message.replace('GraphQL error: ', '')
          : error.message || 'An error occurred during registration',
      );
    }
  };

  return (
    <>
      <Head>
        <title>Sign up | Coinvancleef</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
            </div>

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
              <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
