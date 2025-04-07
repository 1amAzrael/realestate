import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { 
  FaHome, FaPencilAlt, FaMapMarkerAlt, FaTag, FaBed, 
  FaBath, FaParking, FaCouch, FaDollarSign, FaUpload, 
  FaTimes, FaImages 
} from "react-icons/fa";
import axios from 'axios';

export default function EditListingModal({ isOpen, onClose, selectedListing, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    discountPrice: "",
    offer: false,
    parking: false,
    furnished: false,
  });
  
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  
  // Initialize form data when selectedListing changes
  useEffect(() => {
    if (selectedListing) {
      setFormData({
        name: selectedListing.name || "",
        address: selectedListing.address || "",
        description: selectedListing.description || "",
        type: selectedListing.type || "",
        bedrooms: selectedListing.bedrooms || "",
        bathrooms: selectedListing.bathrooms || "",
        price: selectedListing.price || "",
        discountPrice: selectedListing.discountPrice || "",
        offer: selectedListing.offer || false,
        parking: selectedListing.parking || false,
        furnished: selectedListing.furnished || false,
      });
      
      setImageUrls(selectedListing.imageURL || []);
    }
  }, [selectedListing]);
  
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0 && files.length + imageUrls.length <= 6) {
      setUploadingImages(true);
      setImageUploadError(null);
      
      try {
        const uploadPromises = Array.from(files).map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "my_unsigned_preset");
          return axios
            .post("https://api.cloudinary.com/v1_1/azrael21/image/upload", formData)
            .then((res) => res.data.secure_url);
        });
        
        const urls = await Promise.all(uploadPromises);
        setImageUrls((prev) => [...prev, ...urls]);
        setUploadingImages(false);
      } catch (error) {
        setImageUploadError("Error uploading images");
        setUploadingImages(false);
      }
    } else {
      setImageUploadError("You can upload up to 6 images total");
    }
  };
  
  // Remove image from the list
  const handleRemoveImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (imageUrls.length === 0) {
      setImageUploadError("At least one image is required");
      return;
    }
    
    if (+formData.price < +formData.discountPrice) {
      setImageUploadError("Discount price must be lower than regular price");
      return;
    }
    
    const updatedData = {
      ...formData,
      imageURL: imageUrls,
    };
    
    onSave(updatedData);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaPencilAlt className="mr-3 text-blue-600" />
            Edit Listing
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>
            
            {/* Second Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required={formData.offer}
                    disabled={!formData.offer}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="offer"
                    checked={formData.offer}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="offer" className="ml-2 text-sm text-gray-700">
                    Special Offer
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parking"
                    checked={formData.parking}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="parking" className="ml-2 text-sm text-gray-700">
                    Parking Available
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
                    Furnished
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Max 6)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor="images" className="cursor-pointer block">
                <FaUpload className="mx-auto text-gray-400 mb-2 h-10 w-10" />
                <p className="text-gray-500">Click to upload images</p>
              </label>
            </div>
            
            {uploadingImages && (
              <p className="text-blue-500 text-sm mt-2">Uploading images...</p>
            )}
            
            {imageUploadError && (
              <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>
            )}
            
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="h-20 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}