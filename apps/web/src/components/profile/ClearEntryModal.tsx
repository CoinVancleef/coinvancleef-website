import React, { useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { Difficulty } from '../../touhou-types/enums';
import { useUserClears } from './UserClears';
import GameSelector from './form/GameSelector';
import ShotTypeSelector from './form/ShotTypeSelector';
import DifficultySelector from './form/DifficultySelector';
import ConditionsCheckboxes from './form/ConditionsCheckboxes';
import CountInputs from './form/CountInputs';
import LinkInputs from './form/LinkInputs';
import FormActions from './form/FormActions';

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
  const apolloClient = useApolloClient();
  const [game, setGame] = useState<string>('');
  const [shotType, setShotType] = useState<string>('');
  const [difficulty] = useState<string>(Difficulty.LUNATIC); // Auto-set to Lunatic, no setter needed since it's disabled
  const [isNoDeaths, setIsNoDeaths] = useState<boolean>(false);
  const [isNoBombs, setIsNoBombs] = useState<boolean>(false);
  const [isNo3rdCondition, setIsNo3rdCondition] = useState<boolean>(false);
  const [numberOfDeaths, setNumberOfDeaths] = useState<string>('');
  const [numberOfBombs, setNumberOfBombs] = useState<string>('');
  const [videoLink, setVideoLink] = useState<string>('');
  const [replayLink, setReplayLink] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createClearEntry, { loading }] = useMutation(ADD_CLEAR_ENTRY, {
    onCompleted: async data => {
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

        try {
          // Refresh data by refetching relevant queries
          await apolloClient.refetchQueries({
            include: ['GetUserClearEntries', 'GetUserProfile'],
          });

          console.log('Data refreshed successfully');

          // Close modal
          onClose();
        } catch (err) {
          console.error('Error refreshing data:', err);
          // Still close modal since entry was created
          onClose();
        }
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
    if (isNoDeaths && numberOfDeaths && parseInt(numberOfDeaths, 10) > 0) {
      newErrors.numberOfDeaths = 'Cannot have deaths with No Deaths selected';
    }

    // Check logic for bombs and no-bombs
    if (isNoBombs && numberOfBombs && parseInt(numberOfBombs, 10) > 0) {
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
          numberOfDeaths: numberOfDeaths ? parseInt(numberOfDeaths, 10) : undefined,
          numberOfBombs: numberOfBombs ? parseInt(numberOfBombs, 10) : undefined,
          videoLink: videoLink || undefined,
          replayLink: replayLink || undefined,
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
            <GameSelector
              game={game}
              setGame={value => {
                setGame(value);
                setShotType('');
              }}
              error={errors.game}
            />

            <ShotTypeSelector
              game={game}
              shotType={shotType}
              setShotType={setShotType}
              error={errors.shotType}
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
          />

          <LinkInputs
            videoLink={videoLink}
            setVideoLink={setVideoLink}
            replayLink={replayLink}
            setReplayLink={setReplayLink}
            videoError={errors.videoLink}
            replayError={errors.replayLink}
          />

          <FormActions onCancel={onClose} loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default ClearEntryModal;
