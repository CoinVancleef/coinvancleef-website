import React from 'react';

interface LinkInputsProps {
  videoLink: string;
  setVideoLink: (value: string) => void;
  replayLink: string;
  setReplayLink: (value: string) => void;
  videoError?: string;
  replayError?: string;
}

const LinkInputs: React.FC<LinkInputsProps> = ({
  videoLink,
  setVideoLink,
  replayLink,
  setReplayLink,
  videoError,
  replayError,
}) => {
  return (
    <>
      <div>
        <label htmlFor="videoLink" className="block text-sm font-medium text-gray-300 mb-1">
          Video Link (optional)
        </label>
        <input
          type="text"
          id="videoLink"
          className={`w-full px-3 py-2 rounded bg-gray-700 border ${
            videoError ? 'border-red-500' : 'border-gray-600'
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          value={videoLink}
          onChange={e => setVideoLink(e.target.value)}
          placeholder="https://..."
        />
        {videoError && <p className="mt-1 text-sm text-red-500">{videoError}</p>}
      </div>

      <div>
        <label htmlFor="replayLink" className="block text-sm font-medium text-gray-300 mb-1">
          Replay Link (optional)
        </label>
        <input
          type="text"
          id="replayLink"
          className={`w-full px-3 py-2 rounded bg-gray-700 border ${
            replayError ? 'border-red-500' : 'border-gray-600'
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          value={replayLink}
          onChange={e => setReplayLink(e.target.value)}
          placeholder="https://..."
        />
        {replayError && <p className="mt-1 text-sm text-red-500">{replayError}</p>}
      </div>
    </>
  );
};

export default LinkInputs;
