import React, { useState } from 'react';
import { ProfileIcon, PROFILE_ICON_URLS, PROFILE_ICON_NAMES } from '../../touhou-types';

interface ProfileIconSelectorProps {
  selectedIcon: string | null;
  onSelectIcon: (icon: string) => void;
}

const ProfileIconSelector: React.FC<ProfileIconSelectorProps> = ({
  selectedIcon,
  onSelectIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectIcon = (iconValue: string) => {
    onSelectIcon(iconValue);
    setIsOpen(false);
  };

  // Filter icons based on search query
  const filteredIcons = Object.values(ProfileIcon).filter(icon => {
    const iconName = PROFILE_ICON_NAMES[icon as ProfileIcon];
    return (
      iconName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="relative">
      <label htmlFor="profile-icon" className="block text-sm font-medium text-gray-300 mb-1">
        Select profile picture
      </label>

      <div
        className="flex items-center bg-gray-700 border border-gray-600 rounded-md p-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedIcon ? (
          <div className="flex items-center">
            <img
              src={PROFILE_ICON_URLS[selectedIcon as ProfileIcon]}
              alt={PROFILE_ICON_NAMES[selectedIcon as ProfileIcon]}
              className="w-8 h-8 mr-2"
            />
            <span className="text-white">{PROFILE_ICON_NAMES[selectedIcon as ProfileIcon]}</span>
          </div>
        ) : (
          <div className="text-gray-400">Select a profile icon</div>
        )}
        <div className="ml-auto">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg rounded-md border border-gray-700 max-h-96 overflow-auto">
          <div className="p-2 sticky top-0 bg-gray-800 border-b border-gray-700">
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded py-1 px-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 p-2">
            {filteredIcons.map(icon => (
              <div
                key={icon}
                className={`flex flex-col items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                  selectedIcon === icon ? 'bg-indigo-900/50 border border-indigo-500' : ''
                }`}
                onClick={() => handleSelectIcon(icon)}
                title={PROFILE_ICON_NAMES[icon as ProfileIcon]}
              >
                <img
                  src={PROFILE_ICON_URLS[icon as ProfileIcon]}
                  alt={PROFILE_ICON_NAMES[icon as ProfileIcon]}
                  className="w-12 h-12"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIconSelector;
