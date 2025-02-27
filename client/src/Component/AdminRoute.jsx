import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';  // <-- Import Outlet here

function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser || currentUser.email !== 'adminonly@gmail.com') {
    return <Navigate to="/signin" />;
  }

  return <Outlet />; // This will render the child routes
}

export default AdminRoute;
