import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Signin from './Pages/Signin';
import Profile from './Pages/Profile';
import Header from './Component/Header';
import About from './Pages/About';
import PrivateRoute from './Component/PrivateRoute';
import CreateListing from './Pages/CreateListing.jsx';
import UpdateListing from './Pages/UpdateListing.jsx';
import Listing from './Pages/Listing';
import Search from './Pages/Search';
import UserBookings from './Component/UserBookings';
import LandlordBookings from './Component/LandlordBookings';
import AdminDashboard from './Pages/AdminDashboard';
import { Footer } from './Component/Footer';
import HrPage from './Pages/HrPage';
import PaymentPage from './Pages/PaymentPage';
import ContactLandlord from './Pages/ContactLandlord';
import BookingForm from './Component/BookingForm';
import PaymentVerify from './Pages/PaymentVerify.jsx';
import PaymentSuccess from './Pages/PaymentSuccess.jsx';
import MapPage from './Pages/MapPage';
import Contact from './Pages/Contact';




// Wrapper component to conditionally render Header and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin-dashboard';

  return (
    <div>
      {/* Conditionally render Header */}
      {!isAdminDashboard && <Header />}

      {/* Render children (page content) */}
      <main>{children}</main>

      {/* Conditionally render Footer */}
      {!isAdminDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap all routes with the Layout component */}
        
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/signin"
          element={
            <Layout>
              <Signin />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
        <Route element={<PrivateRoute />}>
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/create-listing"
            element={
              <Layout>
                <CreateListing />
              </Layout>
            }
          />
          <Route
            path="/update-listing/:listingId"
            element={
              <Layout>
                <UpdateListing />
              </Layout>
            }
          />
          <Route
            path="/mybookings"
            element={
              <Layout>
                <UserBookings />
              </Layout>
            }
          />
          <Route
            path="/booking-requests"
            element={
              <Layout>
                <LandlordBookings />
              </Layout>
            }
          />
         
        </Route>
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          } 
        />
        <Route
          path="/listing/:listingId"
          element={
            <Layout>
              <Listing />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/hr"
          element={
            <Layout>
              <HrPage />
            </Layout>
          }
        />
        <Route
          path="/payment"
          element={
            <Layout>
              <PaymentPage />
            </Layout>
          }
        />
        <Route
          path="/book/:listingId"
          element={
            <Layout>
              <BookingForm />
            </Layout>
          }
        />
        <Route
          path="/map"
          element={
            <Layout>
              <MapPage />
            </Layout>
          }
        />
       
        <Route
          path="/contact-landlord/:listingId"
          element={
            <Layout>
              <ContactLandlord />
            </Layout>
          }
        />
        <Route path="/payment/verify" element={<PaymentVerify />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />


        {/* Admin Dashboard (no Header/Footer) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
      
         
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
