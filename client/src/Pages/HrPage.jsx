import React, { useEffect, useState } from "react";
import { Users, Briefcase, Clock, DollarSign, ChevronRight, Star, MapPin, Calendar, Phone, User } from 'lucide-react';
import { useSelector } from "react-redux";

const HrPage = () => {
  const [workers, setWorkers] = useState([]); // State to store workers fetched from the database
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerPhone: "",
    shiftingDate: "",
    shiftingAddress: "",
  });
  const { currentUser } = useSelector((state) => state.user); // Get the current user from Redux store

  // Fetch workers from the database
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch("/api/worker/all");
        if (!res.ok) {
          throw new Error("Failed to fetch workers");
        }
        const data = await res.json();
        setWorkers(data.workers); // Update the workers state with fetched data
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

  const handleHireNow = (worker) => {
    setSelectedWorker(worker);
    setBookingStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        shiftingDate: bookingData.shiftingDate,
        shiftingAddress: bookingData.shiftingAddress,
        workerId: selectedWorker._id,
        userId: currentUser._id,
      };

      console.log("Submitting form data:", requestBody); // Debugging

      const res = await fetch("/api/shiftingRequest/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit shifting request");
      }

      const data = await res.json();
      console.log("Shifting request submitted:", data); // Debugging
      setBookingStep(2); // Move to the next step
    } catch (error) {
      console.error("Error submitting shifting request:", error);
    }
  };

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleConfirmShifting = () => {
    // Redirect to payment page
    window.location.href = "/payment";
  };

  const handleBackToWorkers = () => {
    setSelectedWorker(null);
    setBookingStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <span className="text-blue-200">Human Resource</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {bookingStep === 0 && (
          <div>
            <section className="mb-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-l-4 border-blue-600 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full -mr-32 -mt-32 opacity-50"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Hire Manpower for Shifting</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg max-w-3xl">
                    Need help moving your belongings? RentPal connects you with registered manpower for an easy and
                    stress-free shifting experience.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                      <Users className="h-5 w-5" />
                      Find Workers
                    </button>
                    <button className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-300">
                      <Briefcase className="h-5 w-5" />
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Available Workers</h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400">
                      <line x1="21" y1="10" x2="3" y2="10"></line>
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="14" x2="3" y2="14"></line>
                      <line x1="21" y1="18" x2="3" y2="18"></line>
                    </svg>
                    Sort
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {workers.map((worker) => (
                  <div
                    key={worker._id} // Use worker._id from the database
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                            {worker.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{worker.name}</h4>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{worker.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Experience: <span className="font-semibold">{worker.experience}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Rate: <span className="font-semibold">{worker.rate}</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {worker.specialties.map((specialty, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-medium ${
                          worker.availability === "Immediate"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                        }`}
                      >
                        {worker.availability}
                      </span>
                      <button
                        onClick={() => handleHireNow(worker)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Hire Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {bookingStep === 1 && (
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <button 
                onClick={handleBackToWorkers}
                className="text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-1 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to workers
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Book {selectedWorker.name}</h2>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{selectedWorker.rating} • {selectedWorker.experience} experience</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <User className="inline h-4 w-4 mr-1" /> Your Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={bookingData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" /> Phone Number
                  </label>
                  <input
                    type="number"
                    id="customerPhone"
                    name="customerPhone"
                    value={bookingData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="shiftingDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" /> Shifting Date
                  </label>
                  <input
                    type="date"
                    id="shiftingDate"
                    name="shiftingDate"
                    value={bookingData.shiftingDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="shiftingAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" /> Shifting Address
                  </label>
                  <textarea
                    id="shiftingAddress"
                    name="shiftingAddress"
                    value={bookingData.shiftingAddress}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter the complete address"
                  ></textarea>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {bookingStep === 2 && (
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Booking Confirmed</h2>
              <p className="mb-2 text-lg text-gray-600 dark:text-gray-300">Your booking with {selectedWorker.name} has been confirmed.</p>
              <p className="mb-8 text-gray-500 dark:text-gray-400">We've sent a confirmation to your phone number.</p>
              <p className="mb-6 text-lg font-medium">Are you willing to process Payment?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleConfirmShifting}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
                >
                  Yes
                </button>
                <button
                  onClick={() => setBookingStep(0)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  No, thank you
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HrPage;