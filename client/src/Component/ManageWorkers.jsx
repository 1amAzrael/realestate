// components/ManageWorkers.jsx
import React from "react";

export default function ManageWorkers({ workers, onEditWorker, onDeleteWorker, onAddWorker }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Manage Workers</h2>
        <button
          onClick={onAddWorker}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Worker
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {workers.length === 0 ? (
          <p className="text-gray-600 p-6">No workers found.</p>
        ) : (
          workers.map((worker) => (
            <div
              key={worker._id}
              className="px-6 py-4 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="text-lg font-medium">{worker.name || "Unnamed Worker"}</p>
                <p className="text-sm text-gray-600">Experience: {worker.experience}</p>
                <p className="text-sm text-gray-600">Rate: {worker.rate}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  onClick={() => onEditWorker(worker)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  onClick={() => onDeleteWorker(worker._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}