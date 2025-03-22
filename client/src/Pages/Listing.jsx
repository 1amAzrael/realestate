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
      <div className="max-w-5xl mx-auto p-8 mt-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Property Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Overview */}
          <div>
            <p className="text-gray-300 leading-relaxed text-lg">{listing.description}</p>
          </div>

          {/* Right: Details */}
          <div className="space-y-3">
            <p className="flex items-center text-xl"><FaTag className="mr-2 text-yellow-500" /> Price: <span className="ml-2 font-bold">Rs. {listing.price.toLocaleString()}</span></p>
            {listing.offer && <p className="flex items-center text-xl text-red-400"><FaTag className="mr-2" /> Discount Price: <span className="ml-2 font-bold">Rs. {listing.discountPrice.toLocaleString()}</span></p>}
            <p className="flex items-center text-xl"><FaBed className="mr-2 text-blue-400" /> Bedrooms: <span className="ml-2">{listing.bedrooms}</span></p>
            <p className="flex items-center text-xl"><FaBath className="mr-2 text-blue-300" /> Bathrooms: <span className="ml-2">{listing.bathrooms}</span></p>
            <p className="flex items-center text-xl"><FaCouch className="mr-2 text-green-400" /> Furnished: <span className="ml-2">{listing.furnished ? 'Yes' : 'No'}</span></p>
            <p className="flex items-center text-xl"><FaParking className="mr-2 text-gray-300" /> Parking: <span className="ml-2">{listing.parking ? 'Yes' : 'No'}</span></p>

            <div className="flex items-center mt-4">
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <FaStar
                      key={index}
                      className="text-yellow-400"
                      size={24}
                      style={{ opacity: ratingValue <= averageRating ? 1 : 0.3 }}
                    />
                  );
                })}
              </div>
              <p className="ml-2 text-lg">
                <span className="font-bold">{averageRating ? averageRating.toFixed(1) : '0'}</span>
                <span className="text-gray-400 ml-1">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </p>
            </div>

            {/* Only show Buy/Book buttons if not the owner and not already booked */}
            {!isOwner && !isBooked && (
              <>
                {listing.type === 'sale' && (
                  <button 
                    onClick={() => navigate(`/book/${listing._id}`)}
                    className="mt-4 inline-block px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                  >
                    Buy Now
                  </button>
                )}
                {listing.type === 'rent' && (
                  <button 
                    onClick={() => navigate(`/book/${listing._id}`)}
                    className="mt-4 inline-block px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                  >
                    Book Now
                  </button>
                )}
              </>
            )}

            {/* Show "You already booked" and "Book HR" button if already booked */}
            {!isOwner && isBooked && (
              <div className="mt-4">
                <p className="text-lg font-semibold text-green-400">You already booked this property.</p>
                <button
                  onClick={() => navigate('/hr')} // Redirect to HR booking page
                  className="mt-4 inline-block px-6 py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-500"
                >
                  Book HR
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Reviews & Ratings</h2>
          
          {/* Add Review Form - Only show if user is logged in, not the owner, and can leave reviews */}
          {currentUser && !isOwner && (
            <div className="bg-gray-700 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
              
              <div className="mb-4">
                <p className="mb-2">Your Rating:</p>
                <div className="flex">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index} className="cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => handleRate(ratingValue)}
                          className="hidden"
                        />
                        {ratingValue <= selectedRating ? (
                          <FaStar className="text-yellow-400 mr-1" size={28} />
                        ) : (
                          <FaRegStar className="text-yellow-400 mr-1" size={28} />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">Your Review:</label>
                <textarea
                  value={comment}
                  onChange={handleCommentChange}
                  rows="4"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Share your experience with this property..."
                ></textarea>
              </div>
              
              <button
                onClick={submitReview}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
                disabled={!selectedRating}
              >
                Submit Review
              </button>
            </div>
          )}
          
          {/* Reviews List - Visible to everyone */}
          <div className="space-y-6">
            {reviewLoading ? (
              <p className="text-center text-gray-400">Loading reviews...</p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="bg-gray-700/50 p-5 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-gray-600 h-10 w-10 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-300" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold">{review.username}</h4>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              size={14} 
                              className={i < review.rating ? "text-yellow-400" : "text-gray-500"} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-gray-300">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No reviews yet. {!isOwner && "Be the first to review this property!"}</p>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-6 border-t pt-4 text-gray-400 text-sm">
          <p>Listed on: {new Date(listing.createdAt).toLocaleDateString()} &middot; Last updated: {new Date(listing.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Listing;