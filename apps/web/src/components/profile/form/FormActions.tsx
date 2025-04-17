import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  loading: boolean;
  isEditMode?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, loading, isEditMode = false }) => {
  return (
    <div className="flex justify-between items-center pt-4 w-full">
      <button
        type="button"
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow transition-colors"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update' : 'Add Clear'}
      </button>
    </div>
  );
};

export default FormActions;
