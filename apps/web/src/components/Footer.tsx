import React from 'react';
import { TwitterIcon, YouTubeIcon, GitHubIcon, DiscordIcon } from './icons/SocialIcons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 mb-4">
            <a
              href="https://twitter.com/coinvancleef"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com/@coinvancleef"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors"
              aria-label="YouTube"
            >
              <YouTubeIcon className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/CoinVancleef/coinvancleef-website"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon className="w-6 h-6" />
            </a>
          </div>
          <div className="text-sm text-gray-400">© {new Date().getFullYear()} CoinVancleef</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
