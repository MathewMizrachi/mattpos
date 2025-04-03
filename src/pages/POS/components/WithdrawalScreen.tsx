
import React from 'react';

interface WithdrawalScreenProps {
  onCancel: () => void;
}

const WithdrawalScreen: React.FC<WithdrawalScreenProps> = ({
  onCancel
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Cash Withdrawal</h2>
        <p className="text-center mb-6 text-gray-600">
          This feature is coming soon.
        </p>
        <div className="flex justify-center">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalScreen;
