import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const token = 'gf76etrf7sgfeg756';

  // Fetch users and listings
  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const res = await fetch('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            setError('Failed to fetch users');
            return;
          }
          const data = await res.json();
          setUsers(data);
        } catch (err) {
          setError('Failed to fetch users');
        }
      };
      

    const fetchListings = async () => {
      try {
        const res = await fetch('api/admin/listings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setListings(data);
      } catch (err) {
        setError('Failed to fetch listings');
      }
    };

    fetchUsers();
    fetchListings();
  }, [token]);

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Delete listing
  const handleDeleteListing = async (id) => {
    try {
      await fetch(`/api/admin/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <a className="block px-6 py-3 text-gray-700 hover:bg-gray-200">Manage Users</a>
          <a className="block px-6 py-3 text-gray-700 hover:bg-gray-200">Manage Listings</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-8">Welcome, {currentUser?.username || 'Admin'}</h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* User Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          {users.length ? (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user._id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold">{user.username}</p>
                    <p>{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete User
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </section>

        {/* Listing Management */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Listing Management</h2>
          {listings.length ? (
            <ul className="space-y-4">
              {listings.map((listing) => (
                <li key={listing._id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold">{listing.name}</p>
                    <p>{listing.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete Listing
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No listings found.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPortal;
