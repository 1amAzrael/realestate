import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { FaBed, FaBath, FaParking, FaCouch, FaTag } from 'react-icons/fa';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from 'react-redux';
import Contatct from '../Component/Contatct';

function Listing() {
    const {currentUser} = useSelector((state) => state.user);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0); 
  const [contact, setContact] = useState(false);

  const mainSliderRef = useRef(null);
  
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

    fetchListing();
  }, [listingId]);

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
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button onClick={() => setContact(true)} className='mt-2 inline-block px-3 py-1 text-sm font-bold rounded ml-2 bg-purple-500'>Contact LandLord</button>

          )
              
          }
          {contact && <Contatct listing={listing} />}
          
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
