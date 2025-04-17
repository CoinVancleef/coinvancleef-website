import React from 'react';
import Link from 'next/link';

interface ProfileHeaderProps {
  name: string | null | undefined;
  danmakuPoints: number;
  totalClears?: number;
  lnn?: number;
  lnb?: number;
  l1cc?: number;
  globalRank?: number;
  isOwnProfile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  danmakuPoints,
  totalClears = 0,
  lnn = 0,
  lnb = 0,
  l1cc = 0,
  globalRank,
  isOwnProfile = false,
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-800/90 to-purple-800/90 p-8 mb-6 rounded-t-lg relative">
      {isOwnProfile && (
        <div className="absolute top-4 right-4">
          <Link href="/profile/edit">
            <button className="p-1.5 bg-indigo-700 hover:bg-indigo-600 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
            </button>
          </Link>
        </div>
      )}

      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-4">{name}</h1>

        {globalRank && (
          <div className="mb-6 inline-flex items-center px-5 py-2 bg-black/30 backdrop-blur-sm rounded-full">
            <span className="text-gray-200 font-medium">
              Global Rank <span className="text-white font-bold ml-1 text-lg">#{globalRank}</span>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-2 w-full">
          {/* Danmaku Points */}
          <div className="md:col-span-4 bg-gradient-to-br from-indigo-900/80 to-indigo-950/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-700/40">
            <div className="px-4 py-3 bg-black/20 border-b border-indigo-700/30">
              <h3 className="text-sm font-medium text-indigo-100 uppercase tracking-wider">
                Danmaku Points
              </h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-white text-3xl font-bold">{danmakuPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Total Clears */}
          <div className="md:col-span-4 bg-gradient-to-br from-indigo-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-700/40">
            <div className="px-4 py-3 bg-black/20 border-b border-indigo-700/30">
              <h3 className="text-sm font-medium text-indigo-100 uppercase tracking-wider">
                Total Clears
              </h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-white text-3xl font-bold">{totalClears.toLocaleString()}</p>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="md:col-span-4 bg-gradient-to-br from-purple-800/80 to-purple-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-indigo-700/40">
            <div className="px-4 py-3 bg-black/20 border-b border-indigo-700/30">
              <h3 className="text-sm font-medium text-indigo-100 uppercase tracking-wider">
                Achievements
              </h3>
            </div>
            <div className="grid grid-cols-3 divide-x divide-indigo-800/30">
              <div className="p-3 text-center">
                <p className="text-indigo-200 text-xs uppercase font-medium mb-1">LNN</p>
                <p className="text-white text-xl font-bold">{lnn}</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-indigo-200 text-xs uppercase font-medium mb-1">LNB</p>
                <p className="text-white text-xl font-bold">{lnb}</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-indigo-200 text-xs uppercase font-medium mb-1">L1CC</p>
                <p className="text-white text-xl font-bold">{l1cc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
