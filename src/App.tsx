import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HospitalContextProvider } from './context/HospitalContext';
import { NavigationBar } from './components';
import Home from './assets/pages/Home';
import Login from './assets/pages/Login';
import NotFound from './assets/pages/NotFound';
import Team from './assets/pages/Team';
import Appointments from './assets/pages/Appointments';
import Register from './assets/pages/Register';
import Admin from './assets/pages/Admin';
import Services from './assets/pages/Services';
import { User } from './types/auth';

const App: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<User['role'] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as User['role'] | null;
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, [location.pathname]);

  const isAdmin = isAuthenticated && userRole === 'admin';

  return (
    <HospitalContextProvider>
      <NavigationBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/login" />} />
          <Route path="/appointments" element={isAuthenticated ? <Appointments /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HospitalContextProvider>
  );
};

export default App; 