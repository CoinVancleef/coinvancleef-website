import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import apolloClient from '../lib/apollo-client';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Don't show navbar on login or register pages
  const showNavbar = !router.pathname.includes('/login') && !router.pathname.includes('/register');

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Coinvancleef</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          {showNavbar && <Navbar />}
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}
