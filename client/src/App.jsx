import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import Profile from './Pages/Profile'
import Header from './Component/Header'
import About from './Pages/About'
import PrivateRoute from './Component/PrivateRoute'
import CreateListing from './Pages/createListing'
import UpdateListing from './Pages/updateListing'

function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoute />} >
       <Route path="/profile" element={<Profile />} />
       <Route path="/create-listing" element={<CreateListing />} />
       <Route path="/update-listing/:listingId" element={<UpdateListing />} />
      </Route>
      <Route path="/about" element={<About />} />
       
      
    </Routes>
    
    </BrowserRouter>
  )
}

export default App