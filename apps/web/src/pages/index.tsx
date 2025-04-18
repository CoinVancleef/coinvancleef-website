import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Head>
        <title>CoinVancleef | Home</title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to CoinVancleef</h1>
              <p className="text-lg text-gray-600 mb-8">
                Your trusted platform for financial insights
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
