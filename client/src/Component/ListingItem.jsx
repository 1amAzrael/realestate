import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
      <Link to={`/listing/${listing._id}`}>
        {/* Image */}
        <div className="relative w-full h-64">
          <img
            src={
              listing.imageURL[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt="listing cover"
            className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          {/* Listing Name */}
          <p className="text-lg font-semibold text-slate-700 truncate">{listing.name}</p>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MdLocationOn className="h-5 w-5 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">{listing.address}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>

          {/* Details */}
          <div className="flex gap-4 mt-3">
            <div className="font-bold text-xs text-gray-700">
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs text-gray-700">
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
