import React, { useState, useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { Difficulty, TouhouGame } from '../../touhou-types/enums';
import { useAuth } from '../../contexts/AuthContext';
import GameSelector from './form/GameSelector';
import ShotTypeSelector from './form/ShotTypeSelector';
import DifficultySelector from './form/DifficultySelector';
import ConditionsCheckboxes from './form/ConditionsCheckboxes';
import CountInputs from './form/CountInputs';
import LinkInputs from './form/LinkInputs';
import FormActions from './form/FormActions';
import { ClearEntry } from './ClearsTable';
import {
  ADD_CLEAR_ENTRY,
  UPDATE_CLEAR_ENTRY,
  DELETE_CLEAR_ENTRY,
} from './mutations/clearEntryMutations';

interface ClearEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: ClearEntry;
}

const ClearEntryModal: React.FC<ClearEntryModalProps> = ({ isOpen, onClose, entryToEdit }) => {
  const apolloClient = useApolloClient();
  const { user, logout } = useAuth();
  const [game, setGame] = useState<string>('');
  const [shotType, setShotType] = useState<string>('');
  const [difficulty] = useState<string>(Difficulty.LUNATIC); // Auto-set to Lunatic
  const [isNoDeaths, setIsNoDeaths] = useState<boolean>(false);
  const [isNoBombs, setIsNoBombs] = useState<boolean>(false);
  const [isNo3rdCondition, setIsNo3rdCondition] = useState<boolean>(false);
  const [numberOfDeaths, setNumberOfDeaths] = useState<string>('');
  const [numberOfBombs, setNumberOfBombs] = useState<string>('');
  const [videoLink, setVideoLink] = useState<string>('');
  const [replayLink, setReplayLink] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  const isEditMode = !!entryToEdit;

  // Initialize form with entry data if in edit mode
  useEffect(() => {
    if (entryToEdit) {
      setGame(entryToEdit.game);
      setShotType(entryToEdit.shotType);
      setIsNoDeaths(entryToEdit.isNoDeaths);
      setIsNoBombs(entryToEdit.isNoBombs);
      setIsNo3rdCondition(entryToEdit.isNo3rdCondition);
      setNumberOfDeaths(entryToEdit.numberOfDeaths?.toString() || '');
      setNumberOfBombs(entryToEdit.numberOfBombs?.toString() || '');
      setVideoLink(entryToEdit.videoLink || '');
      setReplayLink(entryToEdit.replayLink || '');
    } else {
      // Reset form when not in edit mode
      setGame('');
      setShotType('');
      setIsNoDeaths(false);
      setIsNoBombs(false);
      setIsNo3rdCondition(false);
      setNumberOfDeaths('');
      setNumberOfBombs('');
      setVideoLink('');
      setReplayLink('');
    }
    setErrors({});
    setDeleteConfirmOpen(false);
  }, [entryToEdit, isOpen]);

  const [createClearEntry, { loading: createLoading }] = useMutation(ADD_CLEAR_ENTRY, {
    onCompleted: handleMutationComplete,
    onError: handleMutationError,
  });

  const [updateClearEntry, { loading: updateLoading }] = useMutation(UPDATE_CLEAR_ENTRY, {
    onCompleted: handleMutationComplete,
    onError: handleMutationError,
  });

  const [deleteClearEntry, { loading: deleteLoading }] = useMutation(DELETE_CLEAR_ENTRY, {
    onCompleted: async data => {
      if (data.deleteClearEntry) {
        try {
          await apolloClient.refetchQueries({
            include: ['GetUserClearEntries', 'GetUserProfile'],
          });
          onClose();
        } catch (err) {
          console.error('Error refreshing data:', err);
          onClose();
        }
      } else {
        setErrors({ delete: 'Failed to delete clear entry. Please try again.' });
      }
    },
    onError: handleMutationError,
  });

  function handleMutationComplete(data: any) {
    const result = isEditMode ? data?.updateClearEntry : data?.createClearEntry;
    console.log('Mutation result:', result);

    if (result?.errors && result.errors.length > 0) {
      // Display errors to the user
      const serverErrors: Record<string, string> = {};
      result.errors.forEach((err: any) => {
        serverErrors[err.field] = err.message;
      });
      setErrors(serverErrors);
      console.error('Server validation errors:', serverErrors);
    } else if (result?.clearEntry) {
      console.log('Entry saved successfully:', result.clearEntry);

      try {
        // Refresh data by refetching relevant queries
        apolloClient
          .refetchQueries({
            include: ['GetUserClearEntries', 'GetUserProfile'],
          })
          .then(() => {
            console.log('Data refreshed successfully');
            onClose();
          })
          .catch(err => {
            console.error('Error refreshing data:', err);
            onClose();
          });
      } catch (err) {
        console.error('Error refreshing data:', err);
        onClose();
      }
    } else {
      console.error('Unknown error: No entry and no errors returned');
    }
  }

  function handleMutationError(error: any) {
    console.error('GraphQL error:', error);

    if (
      error.message.includes('auth') ||
      error.message.includes('Not authorized') ||
      error.message.includes('Authentication')
    ) {
      setErrors({ auth: 'Authentication error. Your login session may have expired.' });

      // Try to fix auth automatically with a logout
      setTimeout(() => {
        logout();
      }, 3000);
    } else {
      setErrors({ server: `Server error: ${error.message}` });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!game) newErrors.game = 'Game is required';
    if (!shotType) newErrors.shotType = 'Shot type is required';

    // Check logic for deaths and no-deaths
    if (isNoDeaths && numberOfDeaths && parseInt(numberOfDeaths, 10) > 0) {
      newErrors.numberOfDeaths = 'Cannot have deaths with No Deaths selected';
    }

    // Check max limit for deaths (50)
    if (numberOfDeaths && parseInt(numberOfDeaths, 10) > 50) {
      newErrors.numberOfDeaths = 'Cannot have more than 50 deaths';
    }

    // Check logic for bombs and no-bombs
    if (isNoBombs && numberOfBombs && parseInt(numberOfBombs, 10) > 0) {
      newErrors.numberOfBombs = 'Cannot have bombs with No Bombs selected';
    }

    // Check max limit for bombs (99)
    if (numberOfBombs && parseInt(numberOfBombs, 10) > 99) {
      newErrors.numberOfBombs = 'Cannot have more than 99 bombs';
    }

    // At least one of videoLink or replayLink must be provided
    if (!videoLink && !replayLink) {
      newErrors.videoLink = 'At least one video or replay link must be provided';
      newErrors.replayLink = 'At least one video or replay link must be provided';
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

    // Common data fields for both create and update
    const commonData = {
      game,
      shotType,
      achievementType: 'L1CC', // Required field, but server will calculate the correct value
      isNoDeaths,
      isNoBombs,
      isNo3rdCondition,
      numberOfDeaths: numberOfDeaths ? parseInt(numberOfDeaths, 10) : null,
      numberOfBombs: numberOfBombs ? parseInt(numberOfBombs, 10) : null,
      videoLink: videoLink || null,
      replayLink: replayLink || null,
    };

    if (isEditMode && entryToEdit) {
      // Verify ownership before updating
      if (entryToEdit && user) {
        // Update existing entry - don't include difficulty field
        updateClearEntry({
          variables: {
            data: {
              public_uuid: entryToEdit.public_uuid,
              ...commonData,
            },
          },
        });
      } else {
        setErrors({ auth: 'You cannot edit this entry. Please refresh and try again.' });
      }
    } else {
      // Create new entry - include difficulty field
      createClearEntry({
        variables: {
          data: {
            ...commonData,
            difficulty: Difficulty.LUNATIC, // Only include difficulty for new entries
          },
        },
      });
    }
  };

  const handleDelete = () => {
    if (!user) {
      setErrors({ auth: 'You need to be logged in to delete entries. Please log in again.' });
      setTimeout(() => {
        logout();
      }, 3000);
      return;
    }

    if (entryToEdit) {
      deleteClearEntry({
        variables: { publicUuid: entryToEdit.public_uuid },
      });
    }
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

  const DeleteConfirmation = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-75"
        onClick={() => setDeleteConfirmOpen(false)}
      ></div>
      <div className="relative bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 z-[70] shadow-xl">
        <h3 className="text-lg font-medium text-white mb-4">Confirm Deletion</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this clear entry? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setDeleteConfirmOpen(false)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="relative bg-gray-800 rounded-lg max-w-lg w-full mx-4 my-8 z-50 overflow-hidden shadow-xl transform transition-all">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {isEditMode ? 'Edit Clear Entry' : 'Add New Clear'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white focus:outline-none">
              <span className="text-2xl font-bold">×</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Server Error Messages */}
            {(errors.server || errors.danmaku_points || errors.delete || errors.auth) && (
              <div className="bg-red-900 text-white p-4 rounded-lg shadow mb-4">
                {errors.server && <p>{errors.server}</p>}
                {errors.auth && <p>{errors.auth}</p>}
                {errors.delete && <p>{errors.delete}</p>}
                {errors.danmaku_points && (
                  <>
                    <h3 className="font-bold text-lg mb-1">Duplicate Clear Detected</h3>
                    <p>{errors.danmaku_points}</p>
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <GameSelector
                game={game}
                setGame={value => {
                  setGame(value);
                  if (!isEditMode) {
                    setShotType('');
                  }
                }}
                error={errors.game}
                disabled={isEditMode}
              />

              <ShotTypeSelector
                game={game}
                shotType={shotType}
                setShotType={setShotType}
                error={errors.shotType}
                disabled={isEditMode}
              />
            </div>

            <DifficultySelector difficulty={difficulty} />

            <ConditionsCheckboxes
              isNoDeaths={isNoDeaths}
              setIsNoDeaths={setIsNoDeaths}
              isNoBombs={isNoBombs}
              setIsNoBombs={setIsNoBombs}
              isNo3rdCondition={isNo3rdCondition}
              setIsNo3rdCondition={setIsNo3rdCondition}
              setNumberOfDeaths={setNumberOfDeaths}
              setNumberOfBombs={setNumberOfBombs}
              selectedGame={game as TouhouGame}
            />

            <CountInputs
              numberOfDeaths={numberOfDeaths}
              setNumberOfDeaths={setNumberOfDeaths}
              numberOfBombs={numberOfBombs}
              setNumberOfBombs={setNumberOfBombs}
              isNoDeaths={isNoDeaths}
              isNoBombs={isNoBombs}
              deathsError={errors.numberOfDeaths}
              bombsError={errors.numberOfBombs}
              selectedGame={game as TouhouGame}
            />

            <LinkInputs
              videoLink={videoLink}
              setVideoLink={setVideoLink}
              replayLink={replayLink}
              setReplayLink={setReplayLink}
              videoError={errors.videoLink}
              replayError={errors.replayLink}
            />

            <div className="flex justify-between items-center pt-4">
              {isEditMode ? (
                <>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmOpen(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition-colors"
                    >
                      Delete Entry
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow transition-colors"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow transition-colors disabled:opacity-50"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Updating...' : 'Update'}
                  </button>
                </>
              ) : (
                <FormActions onCancel={onClose} loading={createLoading} isEditMode={false} />
              )}
            </div>
          </form>
        </div>
      </div>

      {deleteConfirmOpen && <DeleteConfirmation />}
    </>
  );
};

export default ClearEntryModal;
