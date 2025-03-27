import React from "react";
import Modal from "./Modal";
import { FaUser, FaBriefcase, FaDollarSign, FaTags, FaClock, FaStar } from "react-icons/fa";

export default function AddWorkerModal({ isOpen, onClose, workerData, onInputChange, onSave }) {
  // Helper function to format rate input
  const formatRateInput = (value) => {
    // Remove non-numeric characters except decimal point and first dollar sign
    let formattedValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalParts = formattedValue.split('.');
    if (decimalParts.length > 2) {
      formattedValue = `${decimalParts[0]}.${decimalParts[1]}`;
    }
    
    // Prepend $ and add /hr
    return formattedValue ? `$${formattedValue}/hr` : '';
  };

  // Custom onChange handler for rate to format input
  const handleRateChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatRateInput(value);
    
    // Call the original onInputChange with formatted value
    onInputChange({
      target: {
        name,
        value: formattedValue
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Worker</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-6">
          {/* Previous input fields remain the same */}
          
          {/* Updated Rate Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FaDollarSign className="mr-2 text-blue-500" />
                Hourly Rate
              </div>
            </label>
            <input
              type="text"
              name="rate"
              value={workerData.rate}
              onChange={handleRateChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. $25/hr"
            />
            <p className="mt-1 text-sm text-gray-500">Enter rate in dollars per hour</p>
          </div>

          {/* Rest of the form remains the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FaTags className="mr-2 text-blue-500" />
                Specialties
              </div>
            </label>
            <input
              type="text"
              name="specialties"
              value={workerData.specialties}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. Plumbing, Electrical, Moving"
            />
            <p className="mt-1 text-sm text-gray-500">Enter specialties separated by commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FaClock className="mr-2 text-blue-500" />
                Availability
              </div>
            </label>
            <select
              name="availability"
              value={workerData.availability}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select availability</option>
              <option value="Immediate">Immediate</option>
              <option value="1-2 days">1-2 days</option>
              <option value="3-5 days">3-5 days</option>
              <option value="1 week+">1 week+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FaStar className="mr-2 text-blue-500" />
                Initial Rating
              </div>
            </label>
            <div className="flex items-center">
              <input
                type="range"
                name="rating"
                min="0"
                max="5"
                step="1"
                value={workerData.rating}
                onChange={onInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 font-medium text-gray-700">{workerData.rating}</span>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-colors shadow-md"
            >
              Add Worker
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}