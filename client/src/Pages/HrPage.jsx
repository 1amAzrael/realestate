import React from "react";

const workers = [
  { name: "John Doe", experience: "5 years", rate: "$15/hour" },
  { name: "Jane Smith", experience: "3 years", rate: "$12/hour" },
];

const HrPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">RentPal - Human Resource</h1>
        
      </header>
      
      <main className="p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Hire Manpower for Shifting</h2>
          <p className="text-gray-700">Need help moving your belongings? RentPal connects you with registered manpower for an easy and stress-free shifting experience.</p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold">Available Workers</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {workers.map((worker, index) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                <h4 className="text-lg font-semibold">{worker.name}</h4>
                <p className="text-gray-600">Experience: {worker.experience}</p>
                <p className="text-gray-600">Rate: {worker.rate}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Hire Now</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold">Register as a Worker</h3>
          <p className="text-gray-700">If you have experience in shifting and want to join our workforce, register now!</p>
          <a href="/" className="mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Register</a>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        <p>&copy; 2025 RentPal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HrPage;
