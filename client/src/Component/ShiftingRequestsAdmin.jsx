import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaTruck,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaCalendar,
  FaPhone,
  FaHardHat,
  FaStar,
} from "react-icons/fa";

const SectionHeader = ({ title, icon, actionButton }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex justify-between items-center rounded-t-xl">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {actionButton}
    </div>
  );
};

const ShiftingRequestsAdmin = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [shiftingRequests, setShiftingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingRequestIds, setProcessingRequestIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchShiftingRequests = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/shiftingRequest/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch shifting requests");
        }
        setShiftingRequests(data.shiftingRequests);
        setFilteredRequests(data.shiftingRequests);
      } catch (error) {
        setError(error.message);
        console.error("Fetch Shifting Requests Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShiftingRequests();
  }, [currentUser]);

  useEffect(() => {
    let result = [...shiftingRequests];
    
    if (searchTerm.trim() !== "") {
      result = result.filter(
        request => 
          request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.shiftingAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(result);
  }, [shiftingRequests, searchTerm, statusFilter]);

  const handleUpdateRequestStatus = async (requestId, status) => {
    setError(null);
    setProcessingRequestIds(prev => [...prev, requestId]);
    
    try {
      const res = await fetch(`/api/shiftingRequest/update/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update shifting request status");
      }
      
      const updatedRequests = shiftingRequests.map((request) =>
        request._id === requestId ? { ...request, status, statusUpdated: true } : request
      );
      setShiftingRequests(updatedRequests);
      
      setProcessingRequestIds(prev => prev.filter(id => id !== requestId));
      showSuccess(`Request status updated to ${status}`);
    } catch (error) {
      setError(error.message);
      console.error("Error updating shifting request status:", error);
      setProcessingRequestIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const renderStatusButton = (request, status, colorClass, icon) => {
    if (request.statusUpdated || request.status === status || processingRequestIds.includes(request._id)) {
      if (request.status === status) {
        return (
          <button
            className={`${colorClass} text-white px-4 py-2 rounded-lg ring-2 ring-offset-2 cursor-default flex items-center transform transition-transform duration-200 hover:scale-105`}
          >
            {icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        );
      }
      return null;
    }

    return (
      <button
        onClick={() => handleUpdateRequestStatus(request._id, status)}
        className={`${colorClass} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center transform hover:scale-105 hover:shadow-md`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    );
  };

  return (
    <div>
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md animate-fadeIn fixed top-20 right-4 z-50 w-80">
          <div className="flex">
            <div className="py-1">
              <FaCheckCircle className="w-6 h-6 mr-4" />
            </div>
            <div>
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-700 hover:text-green-800"
            >
              <FaTimesCircle />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="inline-block relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <SectionHeader 
          title="Shifting Requests" 
          icon={<FaTruck className="text-indigo-500 mr-2" />}
          actionButton={
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredRequests.length} requests
              </span>
            </div>
          }
        />
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
            <p className="text-gray-500 text-lg">Loading shifting requests...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-red-500 text-xl" />
            </div>
            <p className="text-gray-800 text-lg font-semibold">Error Loading Requests</p>
            <p className="text-gray-500 mt-2">{error}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                // Get worker details if available
                const workerDetails = request.workerId && typeof request.workerId === 'object' 
                  ? request.workerId 
                  : null;
                
                return (
                  <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div className="mb-4 md:mb-0 md:w-1/2">
                        <div className="flex items-center mb-2">
                          <div className={`p-2 rounded-full mr-3 ${
                            request.status === 'approved' ? 'bg-green-100' :
                            request.status === 'rejected' ? 'bg-red-100' :
                            request.status === 'completed' ? 'bg-blue-100' :
                            'bg-yellow-100'
                          }`}>
                            {request.status === 'approved' ? 
                              <FaCheckCircle className="text-green-600" /> :
                              request.status === 'rejected' ? 
                              <FaTimesCircle className="text-red-600" /> :
                              request.status === 'completed' ?
                              <FaCheckCircle className="text-blue-600" /> :
                              <FaSpinner className="text-yellow-600" />
                            }
                          </div>
                          <h3 className="text-lg font-semibold">{request.customerName}</h3>
                        </div>
                        <p className="text-gray-600 flex items-center mb-1">
                          <FaMapMarkerAlt className="h-4 w-4 mr-1 text-gray-500" />
                          {request.shiftingAddress}
                        </p>
                        <p className="text-gray-600 flex items-center mb-2">
                          <FaCalendar className="h-4 w-4 mr-1 text-gray-500" />
                          {new Date(request.shiftingDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <FaPhone className="h-4 w-4 mr-1 text-gray-500" />
                          {request.customerPhone}
                        </p>
                        
                        {request.payment && (
                          <div className="mt-3 bg-gray-100 p-2 rounded-lg">
                            <p className="text-gray-700 text-sm">
                              <span className="font-medium">Payment Status:</span> {' '}
                              <span className={`${
                                request.payment.status === 'completed' ? 'text-green-600' : 
                                request.payment.status === 'failed' ? 'text-red-600' : 
                                'text-yellow-600'
                              }`}>
                                {request.payment.status.charAt(0).toUpperCase() + request.payment.status.slice(1)}
                              </span>
                            </p>
                            {request.payment.method && (
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">Payment Method:</span> {' '}
                                {request.payment.method.charAt(0).toUpperCase() + request.payment.method.slice(1)}
                              </p>
                            )}
                            {request.totalAmount && (
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">Amount:</span> NPR {request.totalAmount.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 md:mb-0 border border-gray-200 md:w-1/3">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaHardHat className="mr-2 text-indigo-500" />
                          Worker Details
                        </h4>
                        {workerDetails ? (
                          <div className="space-y-2">
                            <p className="flex items-center">
                              <span className="font-medium mr-1">Name:</span> 
                              <span className="text-gray-800">{workerDetails.name || "No name provided"}</span>
                            </p>
                            <p className="flex items-center">
                              <span className="font-medium mr-1">Experience:</span> 
                              <span className="text-gray-800">{workerDetails.experience || "Not specified"}</span>
                            </p>
                            <p className="flex items-center">
                              <span className="font-medium mr-1">Rate:</span> 
                              <span className="text-gray-800">
                                {workerDetails.rate ? `Rs. ${workerDetails.rate}` : "Not specified"}
                              </span>
                            </p>
                            {workerDetails.specialties && (
                              <p className="flex items-center">
                                <span className="font-medium mr-1">Specialties:</span> 
                                <span className="text-gray-800">
                                  {Array.isArray(workerDetails.specialties) 
                                    ? workerDetails.specialties.join(', ')
                                    : workerDetails.specialties}
                                </span>
                              </p>
                            )}
                            {workerDetails.rating && (
                              <p className="flex items-center">
                                <span className="font-medium mr-1">Rating:</span> 
                                <div className="flex items-center ml-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                      key={i}
                                      className={i < workerDetails.rating ? "text-yellow-500" : "text-gray-300"}
                                      size={14}
                                    />
                                  ))}
                                  <span className="ml-1 text-sm text-gray-600">({workerDetails.rating})</span>
                                </div>
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-500 italic mb-2">
                              No worker assigned or worker information not available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2 justify-end">
                      {processingRequestIds.includes(request._id) ? (
                        <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </div>
                      ) : (
                        <>
                          {!request.statusUpdated ? (
                            <>
                              {renderStatusButton(
                                request, 
                                "approved", 
                                "bg-gradient-to-r from-green-500 to-green-600", 
                                <FaCheckCircle className="mr-2" />
                              )}
                              {renderStatusButton(
                                request, 
                                "rejected", 
                                "bg-gradient-to-r from-red-500 to-red-600", 
                                <FaTimesCircle className="mr-2" />
                              )}
                              {renderStatusButton(
                                request, 
                                "pending", 
                                "bg-gradient-to-r from-yellow-500 to-yellow-600", 
                                <FaSpinner className="mr-2" />
                              )}
                              {renderStatusButton(
                                request, 
                                "completed", 
                                "bg-gradient-to-r from-blue-500 to-blue-600", 
                                <FaCheckCircle className="mr-2" />
                              )}
                            </>
                          ) : (
                            <div className={`
                              ${request.status === 'approved' 
                                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                : request.status === 'rejected' 
                                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                : request.status === 'completed'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              } text-white px-4 py-2 rounded-lg flex items-center shadow-md`}
                            >
                              {request.status === 'approved' ? <FaCheckCircle className="mr-2" /> : 
                               request.status === 'rejected' ? <FaTimesCircle className="mr-2" /> : 
                               request.status === 'completed' ? <FaCheckCircle className="mr-2" /> :
                               <FaSpinner className="mr-2" />}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaTruck className="text-gray-400 text-xl" />
                </div>
                <p className="text-gray-500 text-lg">No shifting requests found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? "Try adjusting your search or filters" : "Shifting requests will appear here when they are created"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShiftingRequestsAdmin;


