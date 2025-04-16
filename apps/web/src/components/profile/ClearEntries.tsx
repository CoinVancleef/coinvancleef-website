import React, { useState } from 'react';
import Link from 'next/link';
import UserClears from './UserClears';
import ClearEntryModal from './ClearEntryModal';

const ClearEntries: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Your Clear Entries</h2>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-indigo-400 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200"
        >
          Add New Clear
        </button>
      </div>

      <UserClears />

      {isModalOpen && <ClearEntryModal isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
};

export default ClearEntries;
