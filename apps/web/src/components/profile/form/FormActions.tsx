import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  loading: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, loading }) => {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        className="mr-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Clear'}
      </button>
    </div>
  );
};

export default FormActions;
