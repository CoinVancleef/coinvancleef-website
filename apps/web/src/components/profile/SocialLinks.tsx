import React from 'react';
import Link from 'next/link';
import { TwitterIcon, YouTubeIcon, TwitchIcon, DiscordIcon } from '../icons/SocialIcons';

interface SocialLinksProps {
  discordTag?: string;
  twitterUrl?: string;
  twitchUrl?: string;
  youtubeUrl?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  discordTag,
  twitterUrl,
  twitchUrl,
  youtubeUrl,
}) => {
  return (
    <div className="flex flex-wrap">
      {discordTag && (
        <div className="mr-4 mb-2 inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-200 hover:text-white">
          <DiscordIcon />
          <span className="ml-2">{discordTag}</span>
        </div>
      )}
      {twitterUrl && (
        <Link
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 mb-2 inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-200 hover:text-white"
        >
          <TwitterIcon />
          <span className="ml-2">Twitter</span>
        </Link>
      )}
      {twitchUrl && (
        <Link
          href={twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 mb-2 inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-200 hover:text-white"
        >
          <TwitchIcon />
          <span className="ml-2">Twitch</span>
        </Link>
      )}
      {youtubeUrl && (
        <Link
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 mb-2 inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-gray-200 hover:text-white"
        >
          <YouTubeIcon />
          <span className="ml-2">YouTube</span>
        </Link>
      )}
    </div>
  );
};

export default SocialLinks;
