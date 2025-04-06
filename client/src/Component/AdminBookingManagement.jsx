import React, { useState, useEffect } from "react";
import { 
  FaCalendarAlt, FaSearch, FaFilter, FaSortAmountDown, 
  FaCheckCircle, FaTimesCircle, FaSpinner, FaEdit, 
  FaEye, FaHome, FaUser, FaMapMarkerAlt, FaCalendarCheck, 
  FaCalendarTimes, FaExclamationCircle
} from "react-icons/fa";
import { format, parseISO, differenceInDays } from 'date-fns';

const AdminBookingManagement = () => {
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
    status: "all"
  });
  
  // Sorting states
  const [sortCriteria, setSortCriteria] = useState("createdAt");
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
        
        // Set state with fetched data
        setBookings(bookingsData);
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
  
  // Helper function to update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/booking/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to update booking status");
      }
      
      // Update local state with the new status
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      
      return true;
    } catch (err) {
      console.error("Error updating booking status:", err);
      return false;
    }
  };
  
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
      if (filters.propertyId && booking.listingId !== filters.propertyId) {
        return false;
      }
      
      // Filter by user
      if (filters.userId && booking.userId !== filters.userId) {
        return false;
      }
      
      // Filter by status
      if (filters.status !== "all" && booking.status !== filters.status) {
        return false;
      }
      
      // Search by booking ID, property name, or user name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const property = properties.find(p => p._id === booking.listingId);
        const user = users.find(u => u._id === booking.userId);
        
        const bookingIdMatch = booking._id.toLowerCase().includes(query);
        const propertyMatch = property && property.name.toLowerCase().includes(query);
        const userMatch = user && user.username.toLowerCase().includes(query);
        const addressMatch = booking.address && booking.address.toLowerCase().includes(query);
        
        return bookingIdMatch || propertyMatch || userMatch || addressMatch;
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
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = a.createdAt;
          valueB = b.createdAt;
      }
      
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };
  
  // Get property name by ID
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p._id === propertyId);
    return property ? property.name : "Unknown Property";
  };
  
  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.username : "Unknown User";
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
      status: "all"
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
  
  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
          icon: <FaCheckCircle className="text-green-600 mr-2" />,
          text: "Approved"
        };
      case "rejected":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
          icon: <FaTimesCircle className="text-red-600 mr-2" />,
          text: "Rejected"
        };
      default:
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-200",
          icon: <FaSpinner className="text-yellow-600 mr-2" />,
          text: "Pending"
        };
    }
  };
  
  // The bookings to display after filtering and sorting
  const sortedAndFilteredBookings = getSortedBookings();
  
  // Stats for quick reference
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    rejected: bookings.filter(b => b.status === "rejected").length
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
              Manage and track all property bookings
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-blue-800 text-sm font-medium">Total</span>
              <span className="text-blue-600 text-xl font-bold">{stats.total}</span>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-yellow-800 text-sm font-medium">Pending</span>
              <span className="text-yellow-600 text-xl font-bold">{stats.pending}</span>
            </div>
            <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-green-800 text-sm font-medium">Approved</span>
              <span className="text-green-600 text-xl font-bold">{stats.approved}</span>
            </div>
            <div className="bg-red-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-red-800 text-sm font-medium">Rejected</span>
              <span className="text-red-600 text-xl font-bold">{stats.rejected}</span>
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
              placeholder="Search by property, user or booking ID..."
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
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="preferredDate_asc">Check-in Date (Earliest)</option>
              <option value="preferredDate_desc">Check-in Date (Latest)</option>
              <option value="status_asc">Status (A-Z)</option>
              <option value="status_desc">Status (Z-A)</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSortAmountDown className="text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex flex-wrap gap-3">
                  <StatusFilterButton
                    status="all"
                    currentStatus={filters.status}
                    onClick={() => setFilters(prev => ({ ...prev, status: "all" }))}
                    label="All"
                    color="bg-gray-100 text-gray-800"
                    activeColor="bg-gray-700 text-white"
                  />
                  <StatusFilterButton
                    status="pending"
                    currentStatus={filters.status}
                    onClick={() => setFilters(prev => ({ ...prev, status: "pending" }))}
                    label="Pending"
                    icon={<FaSpinner className="mr-1" />}
                    color="bg-yellow-100 text-yellow-800"
                    activeColor="bg-yellow-500 text-white"
                  />
                  <StatusFilterButton
                    status="approved"
                    currentStatus={filters.status}
                    onClick={() => setFilters(prev => ({ ...prev, status: "approved" }))}
                    label="Approved"
                    icon={<FaCheckCircle className="mr-1" />}
                    color="bg-green-100 text-green-800"
                    activeColor="bg-green-500 text-white"
                  />
                  <StatusFilterButton
                    status="rejected"
                    currentStatus={filters.status}
                    onClick={() => setFilters(prev => ({ ...prev, status: "rejected" }))}
                    label="Rejected"
                    icon={<FaTimesCircle className="mr-1" />}
                    color="bg-red-100 text-red-800"
                    activeColor="bg-red-500 text-white"
                  />
                </div>
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
              const statusDisplay = getStatusDisplay(booking.status);
              const property = properties.find(p => p._id === booking.listingId) || {};
              const user = users.find(u => u._id === booking.userId) || {};
              const isExpanded = expandedBookingId === booking._id;
              
              return (
                <div key={booking._id} className="transition-all duration-200 hover:bg-gray-50">
                  <div className="p-6 cursor-pointer" onClick={() => toggleExpandBooking(booking._id)}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* First column: Property and User info */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center">
                          <FaHome className="text-blue-500 mr-2" />
                          {getPropertyName(booking.listingId)}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center mb-3">
                          <FaMapMarkerAlt className="text-gray-400 mr-1" />
                          {property.address || booking.address || "Address not available"}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center">
                          <FaUser className="text-gray-400 mr-1" />
                          <span className="font-medium">{getUserName(booking.userId)}</span>
                          <span className="ml-1">({user.email || "No email"})</span>
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
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Booking Date</p>
                            <p className="font-medium">{getFormattedDate(booking.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Third column: Status and Actions */}
                      <div className="flex md:justify-end items-start">
                        <div className={`px-4 py-2 rounded-lg flex items-center ${statusDisplay.bgColor} ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          {statusDisplay.text}
                        </div>
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
                            <DetailItem label="Booking ID" value={booking._id} />
                            <DetailItem label="Contact Phone" value={booking.contact || "Not provided"} />
                            <DetailItem label="Customer Name" value={booking.name} />
                            <DetailItem label="Customer Address" value={booking.address} />
                            <DetailItem label="Booking Created" value={getFormattedDate(booking.createdAt)} />
                            <DetailItem label="Last Updated" value={getFormattedDate(booking.updatedAt)} />
                          </div>
                        </div>
                        
                        {/* Right Column: Actions */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Booking Actions</h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-2">Update Booking Status:</p>
                              <div className="flex flex-wrap gap-2">
                                {booking.status !== "approved" && (
                                  <button
                                    onClick={() => updateBookingStatus(booking._id, "approved")}
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                                  >
                                    <FaCheckCircle className="mr-1" />
                                    Approve
                                  </button>
                                )}
                                {booking.status !== "rejected" && (
                                  <button
                                    onClick={() => updateBookingStatus(booking._id, "rejected")}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
                                  >
                                    <FaTimesCircle className="mr-1" />
                                    Reject
                                  </button>
                                )}
                                {booking.status !== "pending" && (
                                  <button
                                    onClick={() => updateBookingStatus(booking._id, "pending")}
                                    className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center text-sm"
                                  >
                                    <FaSpinner className="mr-1" />
                                    Mark as Pending
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Other Actions:</p>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => window.open(`/listing/${booking.listingId}`, '_blank')}
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                                >
                                  <FaEye className="mr-1" />
                                  View Property
                                </button>
                                <button
                                  onClick={() => window.open(`/profile?user=${booking.userId}`, '_blank')}
                                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                                >
                                  <FaUser className="mr-1" />
                                  View User
                                </button>
                                <button
                                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
                                >
                                  <FaEdit className="mr-1" />
                                  Edit Booking
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
};

// Helper component for status filter buttons
const StatusFilterButton = ({ status, currentStatus, onClick, label, icon, color, activeColor }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all ${
      currentStatus === status ? activeColor : color
    }`}
  >
    {icon}
    {label}
    {currentStatus === status && (
      <span className="ml-1 flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
      </span>
    )}
  </button>
);

// Helper component for detail items
const DetailItem = ({ label, value }) => (
  <div className="flex flex-wrap items-start">
    <span className="text-gray-500 text-sm w-36">{label}:</span>
    <span className="text-gray-900 flex-1 font-medium text-sm">{value}</span>
  </div>
);

export default AdminBookingManagement;