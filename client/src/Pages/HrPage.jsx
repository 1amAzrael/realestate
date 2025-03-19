import React, { useState } from "react";
import { Users, Briefcase, Clock, DollarSign, ChevronRight, Star, MapPin, Calendar, Phone, User } from 'lucide-react';
import { Footer } from "../Component/Footer";

const workers = [
  {
    id: 1,
    name: "John Doe",
    experience: "5 years",
    rate: "$15/hour",
    specialties: ["Heavy Lifting", "Furniture Assembly"],
    availability: "Immediate",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Jane Smith",
    experience: "3 years",
    rate: "$12/hour",
    specialties: ["Packing", "Loading"],
    availability: "2 days",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Mike Johnson",
    experience: "7 years",
    rate: "$18/hour",
    specialties: ["Piano Moving", "Appliance Installation"],
    availability: "Weekends",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Sarah Williams",
    experience: "2 years",
    rate: "$11/hour",
    specialties: ["Organization", "Unpacking"],
    availability: "Evenings",
    rating: 4.2,
  },
];

const HrPage = () => {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerPhone: "",
    shiftingDate: "",
    shiftingAddress: "",
  });

  const handleHireNow = (worker) => {
    setSelectedWorker(worker);
    setBookingStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">RentPal <span className="text-purple-200">Human Resource</span></h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {bookingStep === 0 && (
          <div>
            <section className="mb-10">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-indigo-600 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">Hire Manpower for Shifting</h2>
                  <p className="text-gray-600 mb-6 text-lg max-w-3xl">
                    Need help moving your belongings? RentPal connects you with registered manpower for an easy and
                    stress-free shifting experience.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                      <Users className="h-5 w-5" />
                      Find Workers
                    </button>
                    <button className="flex items-center gap-2 border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-full hover:bg-indigo-50 transition-all duration-300">
                      <Briefcase className="h-5 w-5" />
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Available Workers</h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-white hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-white hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
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
                    key={worker.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {worker.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">{worker.name}</h4>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-gray-600 ml-1">{worker.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-indigo-500" />
                          <span className="text-gray-700">
                            Experience: <span className="font-semibold">{worker.experience}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-indigo-500" />
                          <span className="text-gray-700">
                            Rate: <span className="font-semibold">{worker.rate}</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm text-gray-500 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {worker.specialties.map((specialty, idx) => (
                            <span key={idx} className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-gray-50 border-t">
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-medium ${
                          worker.availability === "Immediate"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {worker.availability}
                      </span>
                      <button
                        onClick={() => handleHireNow(worker)}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <button 
                onClick={handleBackToWorkers}
                className="text-indigo-600 mb-6 flex items-center gap-1 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to workers
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Book {selectedWorker.name}</h2>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-600 ml-1">{selectedWorker.rating} • {selectedWorker.experience} experience</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline h-4 w-4 mr-1" /> Your Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={bookingData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" /> Phone Number
                  </label>
                  <input
                    type="number"
                    id="customerPhone"
                    name="customerPhone"
                    value={bookingData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="shiftingDate" className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" /> Shifting Date
                  </label>
                  <input
                    type="date"
                    id="shiftingDate"
                    name="shiftingDate"
                    value={bookingData.shiftingDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="shiftingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" /> Shifting Address
                  </label>
                  <textarea
                    id="shiftingAddress"
                    name="shiftingAddress"
                    value={bookingData.shiftingAddress}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter the complete address"
                  ></textarea>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Booking Confirmed</h2>
              <p className="mb-2 text-lg text-gray-600">Your booking with {selectedWorker.name} has been confirmed.</p>
              <p className="mb-8 text-gray-500">We've sent a confirmation to your phone number.</p>
              <p className="mb-6 text-lg font-medium">Do you need human resource shifting services?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleConfirmShifting}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
                >
                  Yes, I need shifting services
                </button>
                <button
                  onClick={() => setBookingStep(0)}
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  No, thank you
                </button>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Register as a Worker</h3>
                <p className="text-gray-600 mb-6">
                  If you have experience in shifting and want to join our workforce, register now! Enjoy flexible hours
                  and competitive pay rates.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-gray-700">Set your own schedule and availability</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-gray-700">Competitive pay rates based on experience</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-gray-700">Connect with clients in your area</span>
                  </li>
                </ul>
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium">
                  Register Now
                </button>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 hidden md:flex items-center justify-center p-8">
                <img src="/placeholder.svg?height=300&width=400" alt="Workers" className="max-w-full h-auto rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
};

export default HrPage;