import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="h-[70vh] flex items-center justify-center text-center px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-6xl font-extrabold leading-tight tracking-wide mb-4 text-white">
            Welcome to Rentpal
          </h1>
          <p className="text-lg sm:text-xl font-light mb-6 text-blue-100">
            Experience luxurious living spaces, seamless rental solutions, and impeccable service.
          </p>
          <Link
            to="/search"
            className="inline-block bg-gradient-to-r from-blue-700 to-purple-700 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:opacity-80 transition-all"
          >
            Start Searching
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 lg:py-32">
        {/* "Who We Are" Section */}
        <section className="text-center lg:text-center mb-16 lg:mb-32">
          <div className="flex flex-col lg:flex-row justify-center gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">Who We Are</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Rentpal is your dedicated partner in the real estate journey, offering a handpicked selection of luxurious
                rental properties, flats, and homes. Whether you are a renter or landlord, we provide a seamless platform for
                renting and property management that prioritizes trust, comfort, and transparency.
              </p>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                With Rentpal, you can find your dream property with ease, knowing that each listing is verified and tailored to
                meet your needs.
              </p>
            </div>
          </div>
        </section>

        {/* "Our Mission" Section */}
        <section className="text-center lg:text-center mb-16 lg:mb-32">
          <div className="flex flex-col lg:flex-row justify-center gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">Our Mission</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Our mission is simple: to make finding the perfect home or rental effortless, transparent, and luxurious. Rentpal
                brings you closer to high-quality properties and the best customer experience, with 24/7 support and a wide range
                of listings to choose from.
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                We believe that every individual deserves a premium real estate experience—whether you're renting or purchasing.
              </p>
            </div>
          </div>
        </section>

        {/* "Our Core Values" Section */}
        <section className="text-center mb-16 lg:mb-32">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8 space-y-4">
              <div className="text-5xl">🔑</div>
              <h3 className="text-2xl font-semibold">Trust & Integrity</h3>
              <p className="text-lg">
                Our platform is built on trust, ensuring that all listings are verified and secure for both renters and landlords.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8 space-y-4">
              <div className="text-5xl">💼</div>
              <h3 className="text-2xl font-semibold">Excellence in Service</h3>
              <p className="text-lg">
                We strive to offer premium customer support, available 24/7 to assist you with any inquiries and guide you through
                your real estate journey.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8 space-y-4">
              <div className="text-5xl">🔒</div>
              <h3 className="text-2xl font-semibold">Security & Privacy</h3>
              <p className="text-lg">
                Rentpal ensures your personal and payment data is securely protected, making your experience worry-free.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-16 lg:py-32 rounded-xl">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-extrabold mb-4">Ready to Find Your Perfect Home?</h2>
            <p className="text-xl mb-6">
              Join the Rentpal community and discover the easiest way to rent or buy your next property with ease and confidence.
            </p>
            <Link
              to="/search"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:opacity-80 transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}