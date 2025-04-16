import React from 'react';

interface ConditionsCheckboxesProps {
  isNoDeaths: boolean;
  setIsNoDeaths: (value: boolean) => void;
  isNoBombs: boolean;
  setIsNoBombs: (value: boolean) => void;
  isNo3rdCondition: boolean;
  setIsNo3rdCondition: (value: boolean) => void;
  setNumberOfDeaths: (value: string) => void;
  setNumberOfBombs: (value: string) => void;
}

const ConditionsCheckboxes: React.FC<ConditionsCheckboxesProps> = ({
  isNoDeaths,
  setIsNoDeaths,
  isNoBombs,
  setIsNoBombs,
  isNo3rdCondition,
  setIsNo3rdCondition,
  setNumberOfDeaths,
  setNumberOfBombs,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Conditions</label>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
            checked={isNoDeaths}
            onChange={e => {
              setIsNoDeaths(e.target.checked);
              if (e.target.checked) setNumberOfDeaths('0');
              else setNumberOfDeaths('');
            }}
          />
          <span className="ml-2 text-gray-300">No Deaths</span>
        </label>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
            checked={isNoBombs}
            onChange={e => {
              setIsNoBombs(e.target.checked);
              if (e.target.checked) setNumberOfBombs('0');
              else setNumberOfBombs('');
            }}
          />
          <span className="ml-2 text-gray-300">No Bombs</span>
        </label>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
            checked={isNo3rdCondition}
            onChange={e => setIsNo3rdCondition(e.target.checked)}
          />
          <span className="ml-2 text-gray-300">No 3rd Condition</span>
        </label>
      </div>
    </div>
  );
};

export default ConditionsCheckboxes;
