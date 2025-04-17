import React, { useState } from 'react';
import Link from 'next/link';
import UserClears from './UserClears';
import ClearEntryModal from './ClearEntryModal';

interface ClearEntriesProps {
  profileUuid?: string;
  isViewOnly?: boolean;
}

const ClearEntries: React.FC<ClearEntriesProps> = ({ profileUuid, isViewOnly = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-700 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Best Clears</h2>
        {!isViewOnly && (
          <button
            onClick={openModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-indigo-400 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200"
          >
            Add New Clear
          </button>
        )}
      </div>

      <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
        <UserClears profileUuid={profileUuid} isViewOnly={isViewOnly} />
      </div>

      {isModalOpen && <ClearEntryModal isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
};

export default ClearEntries;
