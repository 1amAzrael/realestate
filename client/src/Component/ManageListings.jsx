import React from "react";

export default function ManageListings({ listings, onViewListing, onEditListing, onDeleteListing }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold">Manage Listings</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {listings.length === 0 ? (
          <p className="text-gray-600 p-6">No listings found.</p>
        ) : (
          listings.map((listing) => {
            if (!listing) return null; // Skip undefined listings

            return (
              <div
                key={listing._id}
                className="px-6 py-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="text-lg font-medium">{listing.name || "Unnamed Listing"}</p>
                  <p className="text-sm text-gray-600">{listing.address || "No address"}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    onClick={() => onViewListing(listing)}
                  >
                    View
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    onClick={() => onEditListing(listing)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteListing(listing._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}