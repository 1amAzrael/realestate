import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect non-admin users to the home page
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/all", {
          headers: {
            Authorization: `Bearer ${currentUser.access_token}`,
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
            Authorization: `Bearer ${currentUser.access_token}`,
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
          Authorization: `Bearer ${currentUser.access_token}`,
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
          Authorization: `Bearer ${currentUser.access_token}`,
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Users Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <p className="text-lg font-semibold">{user.username}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Listings Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Listings</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {listings.length === 0 ? (
            <p className="text-gray-600">No listings found.</p>
          ) : (
            listings.map((listing) => (
              <div
                key={listing._id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <p className="text-lg font-semibold">{listing.name}</p>
                  <p className="text-gray-600">{listing.address}</p>
                </div>
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}