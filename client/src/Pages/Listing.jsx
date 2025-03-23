import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import { FaBed, FaBath, FaParking, FaCouch, FaTag, FaStar, FaRegStar, FaUser, FaComment } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from 'react-redux';

function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const { listingId } = useParams();
  const [searchParams] = useSearchParams(); // Get query parameters
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isEligibleForShifting, setIsEligibleForShifting] = useState(false);

  const mainSliderRef = useRef(null);

  // Check if the user has already booked this listing
  const isBooked = searchParams.get('booked') === 'true'; // Check the query parameter

  // Function to calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(reviews);

  // Check if current user is the owner of the listing
  const isOwner = currentUser && listing?.userRef === currentUser._id;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || 'Failed to load listing.');
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const res = await fetch(`/api/reviews/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.error('Failed to load reviews');
          setReviewLoading(false);
          return;
        }
        setReviews(data);
        setReviewLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviewLoading(false);
      }
    };

    fetchListing();
    fetchReviews();
  }, [listingId]);

  const handleBuyNow = () => {
    setTimeout(() => {
      alert('Payment Successful! Your order is being processed.');
      window.location.href = '/';
    }, 2000);
  };

  const handleBookNow = () => {
    const needsHR = window.confirm('Do you require human resource assistance?');
    if (needsHR) {
      window.location.href = '/hr';
    } else {
      alert('Booking confirmed successfully! Redirecting to home page.');
      window.location.href = '/';
    }
  };

  const handleRate = async (newRating) => {
    setSelectedRating(newRating);
  };

  const handleContactLandlord = () => {
    navigate(`/contact-landlord/${listingId}`);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const submitReview = async () => {
    if (!currentUser) {
      alert('Please login to leave a review');
      return;
    }

    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const response = await fetch('/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          userId: currentUser._id,
          username: currentUser.username,
          rating: selectedRating,
          comment,
          createdAt: new Date(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new review to the reviews array
        setReviews([...reviews, {
          _id: data.reviewId,
          userId: currentUser._id,
          username: currentUser.username,
          rating: selectedRating,
          comment,
          createdAt: new Date(),
        }]);

        // Reset the form
        setComment('');
        setSelectedRating(0);

        alert('Review submitted successfully!');
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!listing) {
    return <div className="flex items-center justify-center min-h-screen">No Listing Found.</div>;
  }

  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    adaptiveHeight: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    mainSliderRef.current.slickGoTo(index);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Image Slider */}
      <div className="relative">
        <Slider ref={mainSliderRef} {...sliderSettings}>
          {listing.imageURL.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt="" className="w-full h-[500px] object-cover rounded-md shadow-xl transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>
          ))}
        </Slider>

        {/* Thumbnail Images */}
        <div className="flex justify-center space-x-2 mt-4">
          {listing.imageURL.map((url, index) => (
            <img
              key={index}
              src={url}
              alt=""
              onClick={() => handleThumbnailClick(index)}
              className={`w-20 h-16 object-cover rounded-md cursor-pointer border-2 transition-transform ${currentSlide === index ? 'border-blue-400 scale-110' : 'border-gray-600 hover:scale-105'}`}
            />
          ))}
        </div>

        {/* Overlay Info */}
        <div className="absolute top-10 left-10 z-20 bg-black/50 px-6 py-3 rounded-lg backdrop-blur-md shadow-lg">
          <h1 className="text-4xl font-bold">{listing.name}</h1>
          <p className="text-gray-300">{listing.address}</p>
          <span className={`mt-2 inline-block px-3 py-1 text-sm font-bold uppercase rounded ${listing.type.toLowerCase() === 'sale' ? 'bg-green-500' : 'bg-blue-500'}`}>
            {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {currentUser && !isOwner && (
            <button
              onClick={handleContactLandlord}
              className='mt-2 inline-block px-3 py-1 text-sm font-bold rounded ml-2 bg-purple-500 hover:bg-purple-600 transition-colors duration-300'
            >
              Contact Landlord
            </button>
          )}
          {isOwner && (
            <span className="mt-2 inline-block px-3 py-1 text-sm font-bold rounded ml-2 bg-orange-500">
              Your Property
            </span>
          )}
        </div>
      </div>

      {/* Details Section */}
    <div className="max-w-6xl mx-auto p-6 lg:p-8 mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Property Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left: Description */}
        <div className="md:col-span-3 space-y-6">
          <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              About This Property
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{listing.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center">
              <FaBed className="text-blue-500 dark:text-blue-400 text-2xl mb-2" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">{listing.bedrooms}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Bedrooms</span>
            </div>

            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 flex flex-col items-center">
              <FaBath className="text-green-500 dark:text-green-400 text-2xl mb-2" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">{listing.bathrooms}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Bathrooms</span>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex flex-col items-center">
              <FaParking className="text-purple-500 dark:text-purple-400 text-2xl mb-2" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">{listing.parking ? 'Yes' : 'No'}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Parking</span>
            </div>

            <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center">
              <FaCouch className="text-indigo-500 dark:text-indigo-400 text-2xl mb-2" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">{listing.furnished ? 'Yes' : 'No'}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Furnished</span>
            </div>
          </div>
        </div>

        {/* Right: Price & Action */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Type:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  listing.type === 'rent'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                {listing.offer ? (
                  <>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Original Price:</span>
                      <span className="text-gray-500 dark:text-gray-400 line-through">
                        ${listing.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Discounted Price:</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${listing.discountPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-300">You Save:</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ${(listing.price - listing.discountPrice).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Price:</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${listing.price.toLocaleString()}
                      {listing.type === 'rent' && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8">
                {!isOwner && !isBooked && (
                  <button
                    onClick={() => navigate(`/book/${listing._id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all shadow-lg flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {listing.type === 'rent' ? 'Book Viewing' : 'Request Purchase'}
                  </button>
                )}

                {!isOwner && isBooked && (
                  <div className="space-y-4">
                    <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-lg p-4 flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>You have already booked this property</span>
                    </div>

                    <button
                      onClick={() => navigate('/hr')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transform hover:-translate-y-0.5 transition-all shadow-lg flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Book HR Services
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Listing;
