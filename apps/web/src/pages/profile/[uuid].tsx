import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// This is a wrapper component that redirects to the main profile page with the UUID
export default function PlayerProfilePage() {
  const router = useRouter();
  const { uuid } = router.query;

  React.useEffect(() => {
    if (uuid) {
      // Redirect to the main profile page with the UUID as a query parameter
      router.replace({
        pathname: '/profile',
        query: { uuid },
      });
    }
  }, [uuid, router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Head>
        <title>Loading Profile...</title>
      </Head>
      <div className="text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-center text-gray-400">Loading profile...</p>
      </div>
    </div>
  );
}
