// AdminBookingManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, FaSearch, FaFilter, FaSortAmountDown, 
  FaEye, FaHome, FaUser, FaMapMarkerAlt, FaCalendarCheck, 
  FaEdit, FaExclamationCircle, FaCheck, FaTimes, FaClock
} from "react-icons/fa";
import { format, parseISO } from 'date-fns';

const AdminBookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Filtering states
  const [filters, setFilters] = useState({
    dateRange: { startDate: "", endDate: "" },
    propertyId: "",
    userId: "",
    status: ""
  });
  
  // Sorting states
  const [sortCriteria, setSortCriteria] = useState("preferredDate");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // UI states
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Fetch all bookings, properties, and users when component mounts
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch bookings
        const bookingsRes = await fetch("/api/booking/all");
        const bookingsData = await bookingsRes.json();
        
        if (!bookingsRes.ok) {
          throw new Error(bookingsData.message || "Failed to fetch bookings");
        }
        
        // Fetch properties (listings)
        const propertiesRes = await fetch("/api/listing/all");
        const propertiesData = await propertiesRes.json();
        
        if (!propertiesRes.ok) {
          throw new Error(propertiesData.message || "Failed to fetch properties");
        }
        
        // Fetch users
        const usersRes = await fetch("/api/user/all");
        const usersData = await usersRes.json();
        
        if (!usersRes.ok) {
          throw new Error(usersData.message || "Failed to fetch users");
        }
        
        // Process bookings to include property and user information
        const processedBookings = bookingsData.map(booking => {
          const property = propertiesData.find(p => p._id === (booking.listingId?._id || booking.listingId));
          const user = usersData.find(u => u._id === (booking.userId?._id || booking.userId));
          
          return {
            ...booking,
            property: property || null,
            user: user || null
          };
        });
        
        // Set state with fetched data
        setBookings(processedBookings);
        setProperties(propertiesData);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError(err.message || "An error occurred while fetching data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter bookings based on current filters and search query
  const getFilteredBookings = () => {
    return bookings.filter(booking => {
      // Filter by date range
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        const bookingDate = new Date(booking.preferredDate);
        const startDate = new Date(filters.dateRange.startDate);
        const endDate = new Date(filters.dateRange.endDate);
        
        if (bookingDate < startDate || bookingDate > endDate) {
          return false;
        }
      }
      
      // Filter by property
      if (filters.propertyId && getBookingPropertyId(booking) !== filters.propertyId) {
        return false;
      }
      
      // Filter by user
      if (filters.userId && getBookingUserId(booking) !== filters.userId) {
        return false;
      }
      
      // Filter by status
      if (filters.status && booking.status !== filters.status) {
        return false;
      }
      
      // Search by property name, or user name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const property = booking.property;
        const user = booking.user;
        
        const propertyMatch = property && property.name && property.name.toLowerCase().includes(query);
        const userMatch = user && user.username && user.username.toLowerCase().includes(query);
        const addressMatch = booking.address && booking.address.toLowerCase().includes(query);
        const nameMatch = booking.name && booking.name.toLowerCase().includes(query);
        
        return propertyMatch || userMatch || addressMatch || nameMatch;
      }
      
      return true;
    });
  };
  
  // Sort filtered bookings based on sort criteria and order
  const getSortedBookings = () => {
    const filteredBookings = getFilteredBookings();
    
    return filteredBookings.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortCriteria) {
        case "createdAt":
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
        case "preferredDate":
          valueA = new Date(a.preferredDate);
          valueB = new Date(b.preferredDate);
          break;
        default:
          valueA = a.preferredDate;
          valueB = b.preferredDate;
      }
      
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };
  
  // Helper function to safely get the property ID from a booking
  const getBookingPropertyId = (booking) => {
    // Check if listingId is an object with _id property
    if (booking.listingId && typeof booking.listingId === 'object' && booking.listingId._id) {
      return booking.listingId._id;
    }
    // Otherwise assume listingId is the ID itself
    return booking.listingId;
  };
  
  // Helper function to safely get the user ID from a booking
  const getBookingUserId = (booking) => {
    // Check if userId is an object with _id property
    if (booking.userId && typeof booking.userId === 'object' && booking.userId._id) {
      return booking.userId._id;
    }
    // Otherwise assume userId is the ID itself
    return booking.userId;
  };
  
  // Get property name by ID
  const getPropertyName = (booking) => {
    if (booking.property && booking.property.name) {
      return booking.property.name;
    }
    
    const property = properties.find(p => p._id === getBookingPropertyId(booking));
    return property ? property.name : "Property details unavailable";
  };
  
  // Get user name by ID
  const getUserName = (booking) => {
    if (booking.user && booking.user.username) {
      return booking.user.username;
    }
    
    const user = users.find(u => u._id === getBookingUserId(booking));
    return user ? user.username : "User details unavailable";
  };
  
  // Get formatted date
  const getFormattedDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      return format(parseISO(dateString), "PPP");
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      dateRange: { startDate: "", endDate: "" },
      propertyId: "",
      userId: "",
      status: ""
    });
    setSearchQuery("");
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("dateRange.")) {
      const dateField = name.split(".")[1];
      setFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [dateField]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle sort change
  const handleSortChange = (criteria) => {
    if (sortCriteria === criteria) {
      // Toggle sort order if clicking the same criteria
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new criteria and default to descending order
      setSortCriteria(criteria);
      setSortOrder("desc");
    }
  };
  
  // Toggle expanded booking details
  const toggleExpandBooking = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };
  
  // The bookings to display after filtering and sorting
  const sortedAndFilteredBookings = getSortedBookings();
  
  // Handle view property - FIXED to use the proper ID extraction
  const handleViewProperty = (booking) => {
    const propertyId = getBookingPropertyId(booking);
    if (propertyId) {
      window.open(`/listing/${propertyId}`, '_blank');
    } else {
      console.error("Missing property ID");
      alert("Unable to view property: ID not found");
    }
  };
  
  // Handle edit property - FIXED to use the proper ID extraction
  const handleEditProperty = (booking) => {
    const propertyId = getBookingPropertyId(booking);
    if (propertyId) {
      window.open(`/update-listing/${propertyId}`, '_blank');
    } else {
      console.error("Missing property ID");
      alert("Unable to edit property: ID not found");
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <FaCheck className="mr-2 text-green-600" />;
      case 'rejected':
        return <FaTimes className="mr-2 text-red-600" />;
      default:
        return <FaClock className="mr-2 text-yellow-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaCalendarAlt className="mr-3 text-blue-600" />
              Booking Management
            </h1>
            <p className="mt-1 text-gray-600">
              View and manage all property bookings
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-blue-800 text-sm font-medium">Total Bookings</span>
              <span className="text-blue-600 text-xl font-bold">{bookings.length}</span>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-yellow-800 text-sm font-medium">Pending</span>
              <span className="text-yellow-600 text-xl font-bold">
                {bookings.filter(b => b.status === 'pending').length}
              </span>
            </div>
            <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-green-800 text-sm font-medium">Approved</span>
              <span className="text-green-600 text-xl font-bold">
                {bookings.filter(b => b.status === 'approved').length}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
          {/* Search Bar */}
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by property, user or customer name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaFilter className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={`${sortCriteria}_${sortOrder}`}
              onChange={(e) => {
                const [criteria, order] = e.target.value.split("_");
                setSortCriteria(criteria);
                setSortOrder(order);
              }}
              className="appearance-none pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="preferredDate_desc">Visit Date (Newest)</option>
              <option value="preferredDate_asc">Visit Date (Oldest)</option>
              <option value="createdAt_desc">Booking Date (Newest)</option>
              <option value="createdAt_asc">Booking Date (Oldest)</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSortAmountDown className="text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="dateRange.startDate"
                  value={filters.dateRange.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="dateRange.endDate"
                  value={filters.dateRange.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Property Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property
                </label>
                <select
                  name="propertyId"
                  value={filters.propertyId}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Properties</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* User Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <select
                  name="userId"
                  value={filters.userId}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Users</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800">
            {sortedAndFilteredBookings.length} {sortedAndFilteredBookings.length === 1 ? 'Booking' : 'Bookings'} Found
          </h2>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-12 flex justify-center">
            <div className="flex flex-col items-center text-center">
              <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Bookings</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : sortedAndFilteredBookings.length === 0 ? (
          <div className="p-12 flex justify-center">
            <div className="flex flex-col items-center text-center">
              <FaCalendarAlt className="text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || showFilters 
                  ? "Try adjusting your search criteria or filters" 
                  : "There are no bookings in the system yet"}
              </p>
              {(searchQuery || showFilters) && (
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedAndFilteredBookings.map((booking) => {
              const isExpanded = expandedBookingId === booking._id;
              
              return (
                <div key={booking._id} className="transition-all duration-200 hover:bg-gray-50">
                  <div className="p-6 cursor-pointer" onClick={() => toggleExpandBooking(booking._id)}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* First column: Property and User info */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center">
                          <FaHome className="text-blue-500 mr-2" />
                          {getPropertyName(booking)}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center mb-3">
                          <FaMapMarkerAlt className="text-gray-400 mr-1" />
                          {booking.property?.address || booking.address || "Address not available"}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center">
                          <FaUser className="text-gray-400 mr-1" />
                          <span className="font-medium">{getUserName(booking)}</span>
                          <span className="ml-1">({booking.user?.email || "No email"})</span>
                        </p>
                      </div>
                      
                      {/* Second column: Dates and Status */}
                      <div>
                        <div className="flex items-center mb-2">
                          <FaCalendarCheck className="text-green-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Visit Date</p>
                            <p className="font-medium">{getFormattedDate(booking.preferredDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Booking Date</p>
                            <p className="font-medium">{getFormattedDate(booking.createdAt)}</p>
                          </div>
                        </div>
                        <div className={`mt-2 px-3 py-1 rounded-full inline-flex items-center text-sm ${
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getStatusIcon(booking.status)}
                          <span className="font-medium">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                        </div>
                      </div>
                      
                      {/* Third column: Status and Actions */}
                      <div className="flex md:justify-end items-start">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProperty(booking);
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                        >
                          <FaEye className="mr-2" />
                          View Property
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Booking Details */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Booking Details</h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                            <DetailItem label="Property" value={getPropertyName(booking)} />
                            <DetailItem label="Contact Phone" value={booking.contact || "Not provided"} />
                            <DetailItem label="Customer Name" value={booking.name} />
                            <DetailItem label="Customer Address" value={booking.address} />
                            <DetailItem label="Booking Created" value={getFormattedDate(booking.createdAt)} />
                            <DetailItem label="Last Updated" value={getFormattedDate(booking.updatedAt)} />
                            <DetailItem label="Status" value={
                              <span className="flex items-center">
                                {getStatusIcon(booking.status)}
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            } />
                            <DetailItem label="User Email" value={booking.user?.email || "Email not available"} />
                          </div>
                        </div>
                        
                        {/* Right Column: Actions */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Property Management</h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div>
                              <p className="text-sm text-gray-600 mb-4">Manage this property:</p>
                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => handleViewProperty(booking)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                  <FaEye className="mr-2" />
                                  View Property
                                </button>
                                <button
                                  onClick={() => handleEditProperty(booking)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                >
                                  <FaEdit className="mr-2" />
                                  Edit Property
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for detail items
const DetailItem = ({ label, value }) => (
  <div className="flex flex-wrap items-start">
    <span className="text-gray-500 text-sm w-36">{label}:</span>
    <span className="text-gray-900 flex-1 font-medium text-sm">
      {typeof value === 'object' ? value : value}
    </span>
  </div>
);

export default AdminBookingManagement;
