import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams();
  // State for listing details
  const [listingData, setListingData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    address: '',
    type: 'rent',
    bathrooms: '1',
    bedrooms: '1',
    price: '0',
    discountPrice: '0',
    offer: false,
    parking: false,
    furnished: false,
    imageURL: [],
  });

  // State for image URLs returned from Cloudinary
  const [imageUrls, setImageUrls] = useState([]);
  // State for file selection (optional)
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      try {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListingData(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };
  
    // Invoke the function
    fetchListing();
  }, [params.listingId]);
  

  const { currentUser } = useSelector((state) => state.user);
  

  // Handle changes for text/number inputs
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setListingData({ ...listingData, type: e.target.id });
    } 
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setListingData({ ...listingData, [e.target.id]: e.target.checked });
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setListingData({ ...listingData, [e.target.id]: e.target.value });
    }
    
  };

  // Handle changes for checkboxes
 

  // Upload images to Cloudinary when files are selected
  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    const filesArray = Array.from(selectedFiles);

    try {
      const uploadPromises = filesArray.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my_unsigned_preset'); 
        return axios.post(
          `https://api.cloudinary.com/v1_1/azrael21/image/upload`, 
          formData
        ).then((res) => res.data.secure_url);
      });

      const urls = await Promise.all(uploadPromises);
      setImageUrls(urls);
      console.log('Uploaded image URLs:', urls);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
  
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...listingData,
          imageURL: imageUrls,  // ✅ Include uploaded images
          userRef: currentUser._id,
        }),
      });
  
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Update Listing
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleSubmit}>
          {/* Left Column: Name, Description, Address */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Listing Name"
                value={listingData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter a description"
                rows="4"
                value={listingData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="123 Main St, City"
                value={listingData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Middle Column: Checkboxes & Image Upload */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={listingData.furnished}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="furnished" className="ml-2 text-sm font-medium text-gray-700">
                  Furnished
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="parking"
                  checked={listingData.parking}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="parking" className="ml-2 text-sm font-medium text-gray-700">
                  Parking
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="offer"
                  checked={listingData.offer}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="offer" className="ml-2 text-sm font-medium text-gray-700">
                  Offer
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                className="w-full text-gray-700"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              {imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Listing Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Price, Discount Price, Bathrooms, Bedrooms, Type */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                placeholder="Price"
                value={listingData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price
              </label>
              <input
                type="number"
                id="discountPrice"
                placeholder="Discount Price"
                value={listingData.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  placeholder="Bathrooms"
                  value={listingData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  placeholder="Bedrooms"
                  value={listingData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                value={listingData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Select type</option>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>
          </div>
        </form>
        <div className="mt-10 text-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-10 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition"
          >
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </div>
    </main>
  );
}

export default UpdateListing;
