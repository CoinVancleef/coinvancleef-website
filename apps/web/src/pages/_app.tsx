import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
        <title>CoinVancleef</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          {showNavbar && <Navbar />}
          <Component {...pageProps} />
          {showNavbar && <Footer />}
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}
