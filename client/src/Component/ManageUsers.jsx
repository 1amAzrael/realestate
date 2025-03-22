import React from "react";

export default function ManageUsers({ users, onEditUser, onDeleteUser }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold">Manage Users</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {users.length === 0 ? (
          <p className="text-gray-600 p-6">No users found.</p>
        ) : (
          users.map((user) => {
            // Check if user is defined
            if (!user) return null;

            return (
              <div
                key={user._id}
                className="px-6 py-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-lg font-medium">{user.username || "Unnamed User"}</p>
                    <p className="text-sm text-gray-600">{user.email || "No email"}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    onClick={() => onEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}