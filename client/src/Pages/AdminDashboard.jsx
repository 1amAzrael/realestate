import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../Component/Modal"; // Import the Modal component

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditListingModalOpen, setIsEditListingModalOpen] = useState(false);
  const [isViewListingModalOpen, setIsViewListingModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }
        setUsers(data);
      } catch (error) {
        setError(error.message);
        console.error("Fetch Users Error:", error);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await res.json();
        setListings(data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchListings();
  }, [currentUser]);

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  // Delete a listing
  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/admin/delete-listing/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }
      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  // Edit a user
  const handleEditUser = async (userId, updatedData) => {
    try {
      const res = await fetch(`/api/admin/edit-user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error("Failed to update user");
      }
      const data = await res.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? data : user))
      );
      setIsEditUserModalOpen(false);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  // Edit a listing
  const handleEditListing = async (listingId, updatedData) => {
    try {
      const res = await fetch(`/api/admin/edit-listing/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error("Failed to update listing");
      }
      const data = await res.json();
      setListings((prevListings) =>
        prevListings.map((listing) => (listing._id === listingId ? data : listing))
      );
      setIsEditListingModalOpen(false);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  // Navigation items for sidebar
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Manage Users", icon: "👥" },
    { id: "listings", label: "Manage Listings", icon: "🏠" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  // Get the first letter of a string safely
  const getInitial = (str) => {
    if (!str) return "U";
    return str.charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-indigo-800 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Portal</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-indigo-700 hover:bg-indigo-600"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        
        <div className="mt-8">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                activeTab === item.id 
                  ? "bg-indigo-700" 
                  : "hover:bg-indigo-700"
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-0 w-full p-4">
          <div className={`flex items-center ${!sidebarOpen && "justify-center"}`}>
            <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              {getInitial(currentUser?.username)}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium">{currentUser?.username || "Admin"}</p>
                <p className="text-xs text-indigo-200">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {navItems.find(item => item.id === activeTab)?.label || "Dashboard"}
            </h1>
            
            <div className="flex items-center space-x-4">
              <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                🔔
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
              <div className="flex">
                <div className="py-1">
                  <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Listings</h3>
                <p className="text-3xl font-bold">{listings.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Active Sessions</h3>
                <p className="text-3xl font-bold">1</p>
              </div>
            </div>
          )}
          
          {/* Users Section */}
          {activeTab === "users" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold">Manage Users</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <p className="text-gray-600 p-6">No users found.</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="px-6 py-4 flex justify-between items-center hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="bg-indigo-100 text-indigo-800 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          {getInitial(user.username)}
                        </div>
                        <div>
                          <p className="text-lg font-medium">{user.username || "Unnamed User"}</p>
                          <p className="text-sm text-gray-600">{user.email || "No email"}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditUserModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Listings Section */}
          {activeTab === "listings" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold">Manage Listings</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {listings.length === 0 ? (
                  <p className="text-gray-600 p-6">No listings found.</p>
                ) : (
                  listings.map((listing) => (
                    <div
                      key={listing._id}
                      className="px-6 py-4 flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-lg font-medium">{listing.name || "Unnamed Listing"}</p>
                        <p className="text-sm text-gray-600">{listing.address || "No address"}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          onClick={() => {
                            setSelectedListing(listing);
                            setIsViewListingModalOpen(true);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                          onClick={() => {
                            setSelectedListing(listing);
                            setIsEditListingModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Settings Section */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon.</p>
            </div>
          )}
        </main>
      </div>

      {/* Edit User Modal */}
      <Modal isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedData = {
              username: formData.get("username"),
              email: formData.get("email"),
            };
            handleEditUser(selectedUser._id, updatedData);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                defaultValue={selectedUser?.username}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={selectedUser?.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditUserModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Listing Modal */}
      <Modal isOpen={isEditListingModalOpen} onClose={() => setIsEditListingModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Edit Listing</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedData = {
              name: formData.get("name"),
              address: formData.get("address"),
            };
            handleEditListing(selectedListing._id, updatedData);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={selectedListing?.name}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                defaultValue={selectedListing?.address}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditListingModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* View Listing Modal */}
      <Modal isOpen={isViewListingModalOpen} onClose={() => setIsViewListingModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Listing Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{selectedListing?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="mt-1 text-gray-900">{selectedListing?.address}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsViewListingModalOpen(false)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}