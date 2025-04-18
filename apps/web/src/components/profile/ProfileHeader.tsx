import React from 'react';
import Link from 'next/link';
import { PROFILE_ICON_URLS, ProfileIcon } from '../../touhou-types';

interface ProfileHeaderProps {
  name?: string | null;
  danmakuPoints: number;
  totalClears: number;
  lnn: number;
  lnb: number;
  l1cc: number;
  globalRank?: number | null;
  isOwnProfile: boolean;
  profilePicture?: string | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  danmakuPoints,
  totalClears,
  lnn,
  lnb,
  l1cc,
  globalRank,
  isOwnProfile,
  profilePicture,
}) => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-indigo-800 to-purple-700 py-6 px-6">
        <div className="flex flex-wrap items-center">
          <div className="md:mr-6 mb-4 md:mb-0 flex items-center">
            {profilePicture ? (
              <div className="h-20 w-20 overflow-hidden mr-4 border-2 border-indigo-500 p-1 bg-gray-800 rounded-md shadow-md">
                <img
                  src={PROFILE_ICON_URLS[profilePicture as ProfileIcon]}
                  alt="Profile"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-20 w-20 overflow-hidden mr-4 border-2 border-indigo-500 bg-gray-800 flex items-center justify-center rounded-md shadow-md">
                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{name || 'Anonymous Player'}</h1>
              <p className="text-indigo-200">{globalRank ? `Rank #${globalRank}` : 'Unranked'}</p>
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex flex-wrap gap-4">
              <div className="px-5 py-3 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg transition-all hover:bg-opacity-80">
                <p className="text-sm text-indigo-200 font-medium">Danmaku Points</p>
                <p className="text-xl font-bold text-white">{danmakuPoints}</p>
              </div>
              <div className="px-5 py-3 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg transition-all hover:bg-opacity-80">
                <p className="text-sm text-indigo-200 font-medium">Total Clears</p>
                <p className="text-xl font-bold text-white">{totalClears}</p>
              </div>
              <div className="px-5 py-3 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg transition-all hover:bg-opacity-80 flex-grow md:flex-grow-0">
                <div className="flex gap-6 mt-1">
                  <div className="text-center">
                    <p className="text-xs text-indigo-300">LNN</p>
                    <p className="text-lg font-bold text-white">{lnn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-indigo-300">LNB</p>
                    <p className="text-lg font-bold text-white">{lnb}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-indigo-300">1CC</p>
                    <p className="text-lg font-bold text-white">{l1cc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <div className="absolute top-4 right-4">
          <Link
            href="/profile/edit"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
            Edit
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
