// ListingItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn, MdStar } from 'react-icons/md';
import { FaBed, FaBath, FaRuler, FaParking, FaCouch, FaTag } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      <Link to={`/listing/${listing._id}`} className="block h-full">
        {/* Image with gradient overlay */}
        <div className="relative overflow-hidden">
          <div className="h-64 overflow-hidden">
            <img
              src={listing.imageURL[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={listing.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          
          {/* Tags positioned on the image */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full shadow-md ${
              listing.type === 'rent' 
                ? 'bg-blue-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            
            {listing.offer && (
              <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-red-500 text-white shadow-md">
                Discounted
              </span>
            )}
          </div>
          
          {/* Price tag */}
          <div className="absolute bottom-4 right-4">
            <div className="px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
              <p className="font-bold text-gray-800">
                ${listing.offer ? listing.discountPrice.toLocaleString() : listing.price.toLocaleString()}
                {listing.type === 'rent' && <span className="text-xs font-normal text-gray-500">/month</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">{listing.name}</h3>
          
          <p className="flex items-center text-gray-600 mb-3">
            <MdLocationOn className="h-4 w-4 text-blue-500 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{listing.address}</span>
          </p>
          
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{listing.description}</p>
          
          {/* Property features */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-gray-600 text-sm">
                <FaBed className="text-blue-500 mr-2" />
                <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <FaBath className="text-blue-500 mr-2" />
                <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
              </div>
              {listing.furnished && (
                <div className="flex items-center text-gray-600 text-sm">
                  <FaCouch className="text-blue-500 mr-2" />
                  <span>Furnished</span>
                </div>
              )}
              {listing.parking && (
                <div className="flex items-center text-gray-600 text-sm">
                  <FaParking className="text-blue-500 mr-2" />
                  <span>Parking</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
