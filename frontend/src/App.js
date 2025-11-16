import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardMedecin from './components/DashboardMedecin';
import DashboardPatient from './components/DashboardPatient';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    }
  }, []);

  // Si pas connecté, afficher la page de connexion
  if (!isLoggedIn) {
    return <Login onLoginSuccess={(role) => {
      setIsLoggedIn(true);
      setUserRole(role);
    }} />;
  }

  // Si connecté en tant que médecin
  if (userRole === 'medecin') {
    return <DashboardMedecin />;
  }

  // Si connecté en tant que patient
  if (userRole === 'patient') {
    return <DashboardPatient />;
  }

  return <div>Chargement...</div>;
}

export default App;