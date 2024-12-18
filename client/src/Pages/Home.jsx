import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-32">
        <div className="container mx-auto text-center">
          <h2 className="text-6xl font-bold">Discover Your Dream Room</h2>
          <p className="mt-4 text-xl">Luxury living spaces tailored for your comfort.</p>
          <button className="mt-6 bg-yellow-500 text-gray-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-400 transition duration-300">
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="container mx-auto py-16">
        <h2 className="text-5xl font-bold text-center mb-8">Featured Rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Listing Card */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105">
              <img src={`https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1${index + 1}`} alt={`Room ${index + 1}`} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-3xl font-semibold">Room {index + 1}</h3>
                <p className="text-gray-600 text-lg">$500/month</p>
                <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Our Premium Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-semibold">24/7 Concierge Service</h3>
              <p className="text-gray-300">We're here for you at any time, day or night.</p>
            </div>
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-semibold">Flexible Leasing Options</h3>
              <p className="text-gray-300">Choose the lease terms that work for you.</p>
            </div>
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-semibold">Exclusive Neighborhoods</h3>
              <p className="text-gray-300">Find rooms in the most sought-after areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 RentPal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
