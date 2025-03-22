import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../Component/Modal";
import ManageUsers from "../Component/ManageUsers";
import ManageListings from "../Component/ManageListings";
import ManageWorkers from "../Component/ManageWorkers";
import EditUserModal from "../Component/EditUserModal";
import EditListingModal from "../Component/EditListingModal";
import ViewListingModal from "../Component/ViewListingModal";
import AddWorkerModal from "../Component/AddWorkerModal";
import EditWorkerModal from "../Component/EditWorkerModal";

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [shiftingRequests, setShiftingRequests] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditListingModalOpen, setIsEditListingModalOpen] = useState(false);
  const [isViewListingModalOpen, setIsViewListingModalOpen] = useState(false);
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [isEditWorkerModalOpen, setIsEditWorkerModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerData, setWorkerData] = useState({
    name: "",
    experience: "",
    rate: "",
    specialties: "",
    availability: "",
    rating: 0,
  });
  const [processingRequestIds, setProcessingRequestIds] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }
        setUsers(data);
      } catch (error) {
        setError(error.message);
        console.error("Fetch Users Error:", error);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await res.json();
        setListings(data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchListings();
  }, [currentUser]);

  // Fetch all Workers
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch("/api/worker/all", {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch workers");
        }
        const data = await res.json();
        setWorkers(data.workers || []);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchWorkers();
  }, [currentUser]);

  // Fetch all shifting requests
  useEffect(() => {
    const fetchShiftingRequests = async () => {
      try {
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
      } catch (error) {
        setError(error.message);
        console.error("Fetch Shifting Requests Error:", error);
      }
    };
    fetchShiftingRequests();
  }, [currentUser]);

  // Find worker details by workerId
  const getWorkerDetails = (workerId) => {
    return workers.find(worker => worker._id === workerId) || null;
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/worker/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
        body: JSON.stringify(workerData),
      });
      if (!res.ok) {
        throw new Error("Failed to add worker");
      }
      const data = await res.json();
      setWorkers((prevWorkers) => [...prevWorkers, data.worker]);
      setIsAddWorkerModalOpen(false);
      setWorkerData({
        name: "",
        experience: "",
        rate: "",
        specialties: "",
        availability: "",
        rating: 0,
      });
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleEditWorker = async (workerId, updatedData) => {
    try {
      const res = await fetch(`/api/worker/update/${workerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error("Failed to update worker");
      }
      const data = await res.json();
      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) =>
          worker._id === workerId ? data.worker : worker
        )
      );
      setIsEditWorkerModalOpen(false);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleDeleteWorker = async (workerId) => {
    try {
      const res = await fetch(`/api/worker/delete/${workerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete worker");
      }
      setWorkers((prevWorkers) =>
        prevWorkers.filter((worker) => worker._id !== workerId)
      );
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    setError(null);
    // Add the request ID to processing list to show loading state
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
      
      // Update the request in the state
      setShiftingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status, statusUpdated: true } : request
        )
      );
      
      // Remove from processing list
      setProcessingRequestIds(prev => prev.filter(id => id !== requestId));
    } catch (error) {
      setError(error.message);
      console.error("Error updating shifting request status:", error);
      // Remove from processing list in case of error
      setProcessingRequestIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }
      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleEditUser = async (userId, updatedData) => {
    try {
      const res = await fetch(`/api/admin/edit-user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error("Failed to update user");
      }
      const data = await res.json();
      console.log("Updated User Data:", data); // Log the response
  
      // Update the state with the new user data
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? data : user))
      );
  
      setIsEditUserModalOpen(false);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

    // Handle editing a listing
    const handleEditListing = async (listingId, updatedData) => {
      try {
        const res = await fetch(`/api/admin/edit-listing/${listingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.access_token}`,
          },
          body: JSON.stringify(updatedData),
        });
        if (!res.ok) {
          throw new Error("Failed to update listing");
        }
        const data = await res.json();
        console.log("Updated Listing Data:", data); // Log the response
  
        // Update the state with the new listing data
        setListings((prevListings) =>
          prevListings.map((listing) => (listing._id === listingId ? data : listing))
        );
  
        setIsEditListingModalOpen(false);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setWorkerData({ ...workerData, [e.target.name]: e.target.value });
  };

  // Navigation items for sidebar
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Manage Users", icon: "👥" },
    { id: "listings", label: "Manage Listings", icon: "🏠" },
    { id: "workers", label: "Manage Workers", icon: "👷" },
    { id: "shifting-requests", label: "Shifting Requests", icon: "📦" },
  ];

  // Status button renderer with conditional display
  const renderStatusButton = (request, status, colorClass) => {
    // If status is already the current one or the request is being processed, don't show other buttons
    if (request.statusUpdated || request.status === status || processingRequestIds.includes(request._id)) {
      if (request.status === status) {
        return (
          <button
            className={`${colorClass} text-white px-4 py-2 rounded-lg ring-2 ring-offset-2 cursor-default`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        );
      }
      return null;
    }

    return (
      <button
        onClick={() => handleUpdateRequestStatus(request._id, status)}
        className={`${colorClass} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-indigo-800 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Portal</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-indigo-700 hover:bg-indigo-600"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <div className="mt-8">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                activeTab === item.id
                  ? "bg-indigo-700"
                  : "hover:bg-indigo-700"
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4">
          <div className={`flex items-center ${!sidebarOpen && "justify-center"}`}>
            <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              {currentUser?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium">{currentUser?.username || "Admin"}</p>
                <p className="text-xs text-indigo-200">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
            </h1>
{/* 
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Back to Home
              </button>
            </div> */}
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
              <div className="flex">
                <div className="py-1">
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Listings</h3>
                <p className="text-3xl font-bold">{listings.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Active Sessions</h3>
                <p className="text-3xl font-bold">1</p>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeTab === "users" && (
            <ManageUsers
              users={users}
              onEditUser={(user) => {
                setSelectedUser(user);
                setIsEditUserModalOpen(true);
              }}
              onDeleteUser={(userId) => handleDeleteUser(userId)}
            />
          )}

          {/* Listings Section */}
          {activeTab === "listings" && (
            <ManageListings
              listings={listings}
              onViewListing={(listing) => {
                setSelectedListing(listing);
                setIsViewListingModalOpen(true);
              }}
              onEditListing={(listing) => {
                setSelectedListing(listing);
                setIsEditListingModalOpen(true);
              }}
              onDeleteListing={(listingId) => handleDeleteListing(listingId)}
            />
          )}

          {/* Workers Section */}
          {activeTab === "workers" && (
            <ManageWorkers
              workers={workers}
              onEditWorker={(worker) => {
                setSelectedWorker(worker);
                setIsEditWorkerModalOpen(true);
              }}
              onDeleteWorker={(workerId) => handleDeleteWorker(workerId)}
              onAddWorker={() => setIsAddWorkerModalOpen(true)}
            />
          )}

          {/* Shifting Requests Section */}
          {activeTab === "shifting-requests" && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Shifting Requests</h2>
              <div className="space-y-4">
                {shiftingRequests.length > 0 ? (
                  shiftingRequests.map((request) => {
                    const workerDetails = request.workerId ? getWorkerDetails(request.workerId) : null;
                    
                    return (
                      <div key={request._id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div className="mb-4 md:mb-0 md:w-1/2">
                            <h3 className="text-lg font-semibold">{request.customerName}</h3>
                            <p className="text-gray-600">{request.shiftingAddress}</p>
                            <p className="text-gray-600">{new Date(request.shiftingDate).toLocaleDateString()}</p>
                            
                            {/* Worker Details Section */}
                            <div className="mt-4 bg-gray-50 p-3 rounded-md">
                              <h4 className="font-medium text-gray-700 mb-2">Worker Details</h4>
                              {workerDetails ? (
                                <div className="space-y-1">
                                  <p><span className="font-medium">Name:</span> {workerDetails.name}</p>
                                  <p><span className="font-medium">Experience:</span> {workerDetails.experience}</p>
                                  <p><span className="font-medium">Rate:</span> {workerDetails.rate}</p>
                                  <p><span className="font-medium">Specialties:</span> {workerDetails.specialties}</p>
                                  <p><span className="font-medium">Rating:</span> {workerDetails.rating}/5</p>
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">No worker assigned or worker information not available</p>
                              )}
                            </div>
                            
                            <div className="mt-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 md:w-1/2 md:justify-end">
                            {/* Show loading indicator when processing */}
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
                                {/* Only show status buttons if no update has been made yet */}
                                {!request.statusUpdated ? (
                                  <>
                                    {renderStatusButton(request, "approved", "bg-green-500")}
                                    {renderStatusButton(request, "rejected", "bg-red-500")}
                                    {renderStatusButton(request, "pending", "bg-yellow-500")}
                                  </>
                                ) : (
                                  // Show only the current status button
                                  <div className={`${
                                    request.status === 'approved' ? 'bg-green-500' :
                                    request.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                  } text-white px-4 py-2 rounded-lg`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-600">No shifting requests found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        selectedUser={selectedUser}
        onSave={(updatedData) => handleEditUser(selectedUser._id, updatedData)}
      />

      <EditListingModal
        isOpen={isEditListingModalOpen}
        onClose={() => setIsEditListingModalOpen(false)}
        selectedListing={selectedListing}
        onSave={(updatedData) => handleEditListing(selectedListing._id, updatedData)}
      />

      <ViewListingModal
        isOpen={isViewListingModalOpen}
        onClose={() => setIsViewListingModalOpen(false)}
        selectedListing={selectedListing}
      />

      <AddWorkerModal
        isOpen={isAddWorkerModalOpen}
        onClose={() => setIsAddWorkerModalOpen(false)}
        workerData={workerData}
        onInputChange={handleInputChange}
        onSave={handleAddWorker}
      />

      <EditWorkerModal
        isOpen={isEditWorkerModalOpen}
        onClose={() => setIsEditWorkerModalOpen(false)}
        selectedWorker={selectedWorker}
        onSave={(updatedData) => handleEditWorker(selectedWorker._id, updatedData)}
      />
    </div>
  );
}