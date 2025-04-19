import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import EyeIcon from 'src/components/icons/eye-icon';
import EyeSlashIcon from 'src/components/icons/eye-slash-icon';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  // Validate name - only allow English letters, numbers, spaces, and basic punctuation
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z0-9 \-'_.]+$/;
    return nameRegex.test(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    // Validate name
    if (name && !validateName(name)) {
      setFieldErrors({
        name: 'Name can only contain English letters, numbers, and basic punctuation',
      });
      return;
    }

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle name input with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    // Clear error if field is now valid
    if (validateName(value) && fieldErrors.name) {
      const newErrors = { ...fieldErrors };
      delete newErrors.name;
      setFieldErrors(newErrors);
    }
  };

  return (
    <>
      <Head>
        <title>Sign up | CoinVancleef</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-700 -m-8 mb-6 p-8 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center text-white">Create an Account</h1>
          </div>

          {errorMessage && (
            <div className="bg-red-900/50 border-l-4 border-red-500 text-white px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  fieldErrors.name ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white`}
              />
              {fieldErrors.name && <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email (Optional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white`}
              />
              <p className="mt-1 text-sm text-gray-400">Only used for password recovery.</p>
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
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
