import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import {updateUserStart,updateUserSuccess,updateUserFailure} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

function Profile() {

  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  // Initialize local state with the current user's photoURL
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL);
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();
  

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData and append the file and your upload preset
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_unsigned_preset'); // Replace with your upload preset

    try {
      // Post the file to Cloudinary
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/azrael21/image/upload`, // Replace with your cloud name
        formData
      );
      const newImageUrl = res.data.secure_url;
      console.log('Uploaded image URL:', newImageUrl);

      // Update the local state with the new image URL
      setPhotoURL(newImageUrl);

      // Optionally: update your backend or further state if needed
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

        const updatedData = { ...formData, photoURL }; // Include updated photoURL

        const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'POST', // Use PUT instead of POST
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


  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group group-hover:shadow-lg">
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={uploadImage}
            />
            <img
              onClick={() => fileRef.current.click()}
              className="w-32 h-32 rounded-full border-4 border-gray-100 object-cover transition-all duration-300 group-hover:border-blue-100 cursor-pointer"
              src={photoURL || "https://source.unsplash.com/random/800x800/?person"}
              alt="Profile"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {currentUser.username || "Your Name"}
          </h2>
          <div className="flex items-center mt-2 text-gray-600">
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            <span>{currentUser.email}</span>
          </div>
        </div>

        {/* Profile Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
              onChange={handleChange}
                type="text"
                id="username"
                placeholder="Username"
                defaultValue={currentUser.username}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
              onChange={handleChange}
                type="email"
                id="email"
                placeholder="Email"
                defaultValue={currentUser.email}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-full">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
              onChange={handleChange}
                type="password"
                id="password"
                placeholder="Enter new password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.01]"
          >
            Update Profile
          </button>
        </form>

        {/* Footer Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button className="text-red-600 hover:text-red-700 transition-colors flex items-center font-medium">
            {/* Replace with your own delete account icon or action */}
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Delete Account
          </button>
          <button className="text-blue-600 hover:text-blue-700 transition-colors flex items-center font-medium">
            {/* Replace with your own sign out icon or action */}
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
