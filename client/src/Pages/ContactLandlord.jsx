import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHome, FaPhone, FaEnvelope, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

function ContactLandlord() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  
  const [landlord, setLandlord] = useState(null);
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListingAndLandlord = async () => {
      try {
        setLoading(true);
        
        // First fetch the listing to get userRef
        const listingRes = await fetch(`/api/listing/get/${listingId}`);
        const listingData = await listingRes.json();
        
        if (listingData.success === false) {
          setError(listingData.message || 'Failed to load listing.');
          setLoading(false);
          return;
        }
        
        setListing(listingData);
        
        // Then fetch the landlord using userRef
        const landlordRes = await fetch(`/api/user/${listingData.userRef}`);
        const landlordData = await landlordRes.json();
        
        if (landlordData.success === false) {
          setError(landlordData.message || 'Failed to load landlord information.');
          setLoading(false);
          return;
        }
        
        setLandlord(landlordData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchListingAndLandlord();
  }, [listingId]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleGoBack = () => {
    navigate(`/listing/${listingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-900 dark:text-gray-100 text-xl font-medium">Loading landlord information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center p-4">
        <div className="text-red-500 text-xl font-medium mb-4">{error}</div>
        <button 
          onClick={handleGoBack} 
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          <FaArrowLeft /> <span>Back to Listing</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleGoBack} 
            className="mr-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">Contact the Landlord</h1>
        </div>

        {listing && landlord && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Listing Preview */}
            <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaHome className="mr-2 text-blue-500" /> Property Details
              </h2>
              
              {listing.imageURL && listing.imageURL.length > 0 && (
                <img 
                  src={listing.imageURL[0]} 
                  alt={listing.name} 
                  className="w-full h-40 object-cover rounded-md shadow-md mb-4"
                />
              )}
              
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{listing.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{listing.address}</p>
              
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 text-sm font-bold uppercase rounded ${listing.type?.toLowerCase() === 'sale' ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                <div className="mt-3 text-lg">
                  {listing.offer && listing.discountPrice !== undefined ? (
                    <>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-300">Original Price: </span>
                          <span className="ml-2 text-gray-600 dark:text-gray-300">
                            Rs. {listing.price ? listing.price.toLocaleString() : '0'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-red-500">Discount: </span>
                          <span className="ml-2 text-red-500">
                            - Rs. {(listing.price && listing.discountPrice) ? 
                              (listing.price - listing.discountPrice).toLocaleString() : '0'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-500 font-bold">Final Price: </span>
                          <span className="ml-2 text-yellow-500 font-bold">
                            Rs. {listing.discountPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-yellow-500 font-bold">
                      Rs. {listing.price ? listing.price.toLocaleString() : '0'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form and Landlord Info */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FaUser className="mr-2 text-purple-500" /> Landlord Information
                </h2>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <span className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full mr-3">
                      <FaUser className="text-purple-500 dark:text-purple-300" />
                    </span>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Name</p>
                      <p className="text-lg font-semibold">{landlord.username}</p>
                    </div>
                  </div>
                  {landlord.phone && (
                    <div className="flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
                        <FaPhone className="text-blue-500 dark:text-blue-300" />
                      </span>
                      <div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Phone</p>
                        <p className="text-lg font-semibold">{landlord.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
                      <FaEnvelope className="text-green-500 dark:text-green-300" />
                    </span>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Email</p>
                      <p className="text-lg font-semibold">{landlord.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaPaperPlane className="mr-2 text-green-500" /> Send a Message
              </h2>
              
              <div className="space-y-4">
                <textarea
                  name="message"
                  id="message"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Hi, I am interested in your property. Is it still available?"
                  className="w-full p-4 border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="5"
                ></textarea>
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <Link
                    to={`mailto:${landlord.email}?Subject=Regarding ${listing.name}&body=${message}`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    <FaEnvelope />
                    <span>Send Email</span>
                  </Link>
                  
                  {landlord.phone && (
                    <a
                      href={`tel:${landlord.phone}`}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                    >
                      <FaPhone />
                      <span>Call Now</span>
                    </a>
                  )}
                </div>
                
                <div className="mt-6 text-center text-gray-600 dark:text-gray-300">
                  <p>Please mention the property reference when contacting the landlord.</p>
                  <p className="mt-1 font-semibold">Property ID: {listingId}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactLandlord;
