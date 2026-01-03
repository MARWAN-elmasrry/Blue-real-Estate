import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import HousesPage from './pages/housesPage/HousesPage';
import HouseDetailsPage from './pages/houseDetails/HouseDetailsPage';
import AddDataPage from './pages/addData/AddDataPage';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route 
        path="/login" 
        element={token ? <Navigate to="/houses" replace /> : <LoginPage />} 
      />
      
      <Route
        path="/houses"
        element={
          <ProtectedRoute>
            <HousesPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/houses/:id"
        element={
          <ProtectedRoute>
            <HouseDetailsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddDataPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/houses" replace />} />
      <Route path="*" element={<Navigate to="/houses" replace />} />
    </Routes>
  );
};

export default App;