import React, { useState } from 'react';

const InviteModal = ({ isOpen, onClose }) => {
  return (
    // Modal background overlay
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Modal container */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96 max-w-lg relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            X
          </button>
          {/* Modal header */}
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">Invite friends to Tia’s Server</h2>
          <p className="text-gray-600 text-sm text-center mb-4">
            Share this link with others to grant access to your server!
          </p>
          {/* Link input with Copy button */}
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
            <input
              type="text"
              value="https://tasklearn/Tia’s Server"
              readOnly
              className="bg-transparent flex-1 outline-none text-gray-700 text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText("https://tasklearn/Tia’s Server")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md px-4 py-1 ml-2 text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
      >
        Open Invite Modal
      </button>
      {/* Modal Component */}
      <InviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;
