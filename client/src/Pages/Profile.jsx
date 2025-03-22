import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import UserBookings from '../Component/UserBookings';
import LandlordBookings from '../Component/LandlordBookings';
import ShiftingBookings from '../Component/ShiftingBookings';

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [isLandlord, setIsLandlord] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [shiftingBookings, setShiftingBookings] = useState([]);

  const dispatch = useDispatch();

  // Fetch shifting bookings
  useEffect(() => {
    const fetchShiftingBookings = async () => {
      try {
        const res = await fetch(`/api/shiftingRequest/user/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.access_token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");
        setShiftingBookings(data.shiftingRequests);
      } catch (error) {
        console.error("Fetch Bookings Error:", error);
      }
    };
    fetchShiftingBookings();
  }, [currentUser._id]);


  useEffect(() => {
    const checkIfLandlord = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          console.error("Error fetching listings:", data.message);
          return;
        }
        setIsLandlord(data.length > 0);
        setUserListings(data);
      } catch (error) {
        console.error("Error checking landlord status:", error);
      }
    };

    checkIfLandlord();
  }, [currentUser._id]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_unsigned_preset');

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/azrael21/image/upload`,
        formData
      );
      const newImageUrl = res.data.secure_url;
      setPhotoURL(newImageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const updatedData = { ...formData, photoURL };
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message || "Failed to update profile"));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="mt-4">
          <Link
            to="#"
            onClick={() => setActiveSection('profile')}
            className="block px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Profile
          </Link>
          {isLandlord ? (
            <>
              <Link
                to="/create-listing"
                className="block px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Create Listings
              </Link>
              <Link
                to="#"
                onClick={() => setActiveSection('bookings')}
                className="block px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Booking Requests
              </Link>
            </>
          ) : (
            !currentUser.isAdmin && (
              <>
                <Link
                  to="#"
                  onClick={() => setActiveSection('bookings')}
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  My Bookings
                </Link>
                <Link
                  to="#"
                  onClick={() => setActiveSection('shifting-bookings')}
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Shifting Bookings
                </Link>
              </>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">My Dashboard</h1>
        </header>

        {activeSection === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Section */}
            <section id="profile" className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col items-center mb-6">
                <input
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                  onChange={uploadImage}
                />
                <div className="relative">
                  <img
                    onClick={() => fileRef.current.click()}
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 cursor-pointer transition-transform duration-300 hover:scale-105"
                    src={photoURL || 'https://source.unsplash.com/random/800x800/?person'}
                    alt="Profile"
                  />
                  <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    Edit
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold">{currentUser.username || 'Your Name'}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <EnvelopeIcon className="w-5 h-5 mr-1" />
                  {currentUser.email}
                </p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  onChange={handleChange}
                  type="text"
                  id="username"
                  placeholder="Username"
                  defaultValue={currentUser.username}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  onChange={handleChange}
                  type="email"
                  id="email"
                  placeholder="Email"
                  defaultValue={currentUser.email}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  onChange={handleChange}
                  type="password"
                  id="password"
                  placeholder="Enter new password"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Update Profile
                </button>
              </form>
              <div className="flex justify-between mt-4">
                <button onClick={handleDeleteUser} className="text-red-600 hover:underline">
                  Delete Account
                </button>
                <button onClick={handleSignOut} className="text-blue-600 hover:underline">
                  Sign Out
                </button>
              </div>
            </section>

            {/* Listings Section */}
            {isLandlord && (
              <section id="listings" className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">My Properties</h2>
                {showListingsError && (
                  <p className="text-red-500 mb-4 text-center">Error loading listings</p>
                )}
                {userListings.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {userListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="border p-4 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow duration-300"
                      >
                        <Link to={`/listing/${listing._id}`} className="flex items-center space-x-4">
                          <img
                            src={listing.imageURL[0]}
                            alt="Listing"
                            className="w-16 h-16 rounded object-cover"
                          />
                          <h1 className="text-lg font-semibold">{listing.name}</h1>
                        </Link>
                        <div className="flex space-x-2">
                          <button onClick={() => handleDeleteListing(listing._id)} className="text-red-600 hover:underline">Delete</button>
                          <Link to={`/update-listing/${listing._id}`}>
                            <button className="text-blue-600 hover:underline">Edit</button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center">No properties found.</p>
                )}
              </section>
            )}
          </div>
        )}

        {activeSection === 'bookings' && !currentUser.isAdmin && (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-8">
              {isLandlord ? (
                <LandlordBookings />
              ) : (
                <UserBookings />
              )}
            </div>
          </div>
        )}

        {activeSection === 'shifting-bookings' && !currentUser.isAdmin && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">My Shifting Bookings</h2>
            <div className="space-y-4">
              {shiftingBookings.map((booking) => (
                <div key={booking._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">{booking.customerName}</h3>
                  <p className="text-gray-600">{booking.shiftingAddress}</p>
                  <p className="text-gray-600">{new Date(booking.shiftingDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Status: {booking.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;