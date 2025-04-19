import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Head>
        <title>CoinVancleef | Touhou Leaderboard</title>
        <meta name="description" content="Touhou achievement tracking and leaderboard" />
      </Head>
      <main className="min-h-screen bg-gray-900 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 shadow overflow-hidden rounded-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-300">Track your Touhou achievements</p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6 text-gray-300">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Leaderboard</h2>
                <Link
                  href="/leaderboard"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  View Leaderboard →
                </Link>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {isAuthenticated ? 'Your Profile' : 'Join the Community'}
                </h2>
                <p className="mb-3">
                  {isAuthenticated
                    ? 'View your progress and achievements'
                    : 'Create an account to track your Touhou achievements'}
                </p>

                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Go to Profile →
                  </Link>
                ) : (
                  <div className="space-x-6">
                    <Link
                      href="/login"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
