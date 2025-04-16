import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { getTouhouGameOptions, getShotTypeOptions } from '../../utils/gameOptions';
import { TouhouGame } from '../../touhou-types/enums';

const ADD_CLEAR_ENTRY = gql`
  mutation CreateClearEntry($data: ClearEntryInput!) {
    createClearEntry(data: $data) {
      clearEntry {
        shotType
        game
        isNoDeaths
        isNoBombs
        isNo3rdCondition
        numberOfDeaths
        numberOfBombs
        videoLink
        replayLink
      }
      errors {
        field
        message
      }
    }
  }
`;

interface ClearEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClearEntryModal: React.FC<ClearEntryModalProps> = ({ isOpen, onClose }) => {
  const [game, setGame] = useState<string>('');
  const [shotType, setShotType] = useState<string>('');
  const [isNoDeaths, setIsNoDeaths] = useState<boolean>(false);
  const [isNoBombs, setIsNoBombs] = useState<boolean>(false);
  const [isNo3rdCondition, setIsNo3rdCondition] = useState<boolean>(false);
  const [numberOfDeaths, setNumberOfDeaths] = useState<string>('0');
  const [numberOfBombs, setNumberOfBombs] = useState<string>('0');
  const [videoLink, setVideoLink] = useState<string>('');
  const [replayLink, setReplayLink] = useState<string>('');
  const [dateAchieved, setDateAchieved] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createClearEntry, { loading }] = useMutation(ADD_CLEAR_ENTRY, {
    onCompleted: data => {
      console.log('Submission response:', data);
      if (data.createClearEntry.errors && data.createClearEntry.errors.length > 0) {
        // Display errors to the user
        const serverErrors: Record<string, string> = {};
        data.createClearEntry.errors.forEach((err: any) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
        console.error('Server validation errors:', serverErrors);
      } else if (data.createClearEntry.clearEntry) {
        console.log('Entry created successfully:', data.createClearEntry.clearEntry);
        // Only close modal if successful
        onClose();
      } else {
        console.error('Unknown error: No entry and no errors returned');
      }
    },
    onError: error => {
      console.error('GraphQL error:', error);
      setErrors({ server: 'Server error occurred. Please try again.' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!game) newErrors.game = 'Game is required';
    if (!shotType) newErrors.shotType = 'Shot type is required';

    // Check logic for deaths and no-deaths
    if (isNoDeaths && parseInt(numberOfDeaths, 10) > 0) {
      newErrors.numberOfDeaths = 'Cannot have deaths with No Deaths selected';
    }

    // Check logic for bombs and no-bombs
    if (isNoBombs && parseInt(numberOfBombs, 10) > 0) {
      newErrors.numberOfBombs = 'Cannot have bombs with No Bombs selected';
    }

    // Validate URLs if provided
    if (videoLink && !isValidUrl(videoLink)) {
      newErrors.videoLink = 'Invalid URL format';
    }
    if (replayLink && !isValidUrl(replayLink)) {
      newErrors.replayLink = 'Invalid URL format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    // Submit data
    createClearEntry({
      variables: {
        data: {
          game,
          shotType,
          achievementType: 'L1CC', // Required field, but server will calculate the correct value
          isNoDeaths,
          isNoBombs,
          isNo3rdCondition,
          numberOfDeaths: parseInt(numberOfDeaths, 10),
          numberOfBombs: parseInt(numberOfBombs, 10),
          videoLink: videoLink || undefined,
          replayLink: replayLink || undefined,
          dateAchieved: dateAchieved ? new Date(dateAchieved).toISOString() : undefined,
        },
      },
    });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-gray-800 rounded-lg max-w-lg w-full mx-4 my-8 z-50 overflow-hidden shadow-xl transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Add New Clear</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white focus:outline-none">
            <span className="text-2xl font-bold">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Server Error Messages */}
          {errors.server && (
            <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
              <p>{errors.server}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Game Selection */}
            <div>
              <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-1">
                Game
              </label>
              <select
                id="game"
                className={`w-full px-3 py-2 rounded bg-gray-700 border ${
                  errors.game ? 'border-red-500' : 'border-gray-600'
                } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                value={game}
                onChange={e => {
                  setGame(e.target.value);
                  setShotType(''); // Reset shot type when game changes
                }}
              >
                <option value="">Select Game</option>
                {getTouhouGameOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.game && <p className="mt-1 text-sm text-red-500">{errors.game}</p>}
            </div>

            {/* Shot Type Selection */}
            <div>
              <label htmlFor="shotType" className="block text-sm font-medium text-gray-300 mb-1">
                Shot Type
              </label>
              <select
                id="shotType"
                className={`w-full px-3 py-2 rounded bg-gray-700 border ${
                  errors.shotType ? 'border-red-500' : 'border-gray-600'
                } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                value={shotType}
                onChange={e => setShotType(e.target.value)}
                disabled={!game}
              >
                <option value="">Select Shot Type</option>
                {game &&
                  getShotTypeOptions(game as TouhouGame).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              {errors.shotType && <p className="mt-1 text-sm text-red-500">{errors.shotType}</p>}
            </div>
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Conditions</label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 h-5 w-5 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                  checked={isNoDeaths}
                  onChange={e => {
                    setIsNoDeaths(e.target.checked);
                    if (e.target.checked) setNumberOfDeaths('0');
                  }}
                />
                <span className="ml-2 text-gray-300">No Deaths</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 h-5 w-5 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                  checked={isNoBombs}
                  onChange={e => {
                    setIsNoBombs(e.target.checked);
                    if (e.target.checked) setNumberOfBombs('0');
                  }}
                />
                <span className="ml-2 text-gray-300">No Bombs</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 h-5 w-5 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                  checked={isNo3rdCondition}
                  onChange={e => setIsNo3rdCondition(e.target.checked)}
                />
                <span className="ml-2 text-gray-300">No 3rd Condition</span>
              </label>
            </div>
          </div>

          {/* Death and Bomb Counts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="numberOfDeaths"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Number of Deaths
              </label>
              <input
                type="number"
                id="numberOfDeaths"
                className={`w-full px-3 py-2 rounded bg-gray-700 border ${
                  errors.numberOfDeaths ? 'border-red-500' : 'border-gray-600'
                } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                value={numberOfDeaths}
                onChange={e => setNumberOfDeaths(e.target.value)}
                min="0"
                disabled={isNoDeaths}
              />
              {errors.numberOfDeaths && (
                <p className="mt-1 text-sm text-red-500">{errors.numberOfDeaths}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="numberOfBombs"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Number of Bombs
              </label>
              <input
                type="number"
                id="numberOfBombs"
                className={`w-full px-3 py-2 rounded bg-gray-700 border ${
                  errors.numberOfBombs ? 'border-red-500' : 'border-gray-600'
                } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                value={numberOfBombs}
                onChange={e => setNumberOfBombs(e.target.value)}
                min="0"
                disabled={isNoBombs}
              />
              {errors.numberOfBombs && (
                <p className="mt-1 text-sm text-red-500">{errors.numberOfBombs}</p>
              )}
            </div>
          </div>

          {/* Date Achieved */}
          <div>
            <label htmlFor="dateAchieved" className="block text-sm font-medium text-gray-300 mb-1">
              Date Achieved (optional)
            </label>
            <input
              type="date"
              id="dateAchieved"
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dateAchieved}
              onChange={e => setDateAchieved(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Links */}
          <div>
            <label htmlFor="videoLink" className="block text-sm font-medium text-gray-300 mb-1">
              Video Link (optional)
            </label>
            <input
              type="text"
              id="videoLink"
              className={`w-full px-3 py-2 rounded bg-gray-700 border ${
                errors.videoLink ? 'border-red-500' : 'border-gray-600'
              } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={videoLink}
              onChange={e => setVideoLink(e.target.value)}
              placeholder="https://..."
            />
            {errors.videoLink && <p className="mt-1 text-sm text-red-500">{errors.videoLink}</p>}
          </div>

          <div>
            <label htmlFor="replayLink" className="block text-sm font-medium text-gray-300 mb-1">
              Replay Link (optional)
            </label>
            <input
              type="text"
              id="replayLink"
              className={`w-full px-3 py-2 rounded bg-gray-700 border ${
                errors.replayLink ? 'border-red-500' : 'border-gray-600'
              } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={replayLink}
              onChange={e => setReplayLink(e.target.value)}
              placeholder="https://..."
            />
            {errors.replayLink && <p className="mt-1 text-sm text-red-500">{errors.replayLink}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white focus:outline-none"
              onClick={onClose}
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
        </form>
      </div>
    </div>
  );
};

export default ClearEntryModal;
