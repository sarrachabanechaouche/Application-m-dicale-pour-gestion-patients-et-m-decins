import React, { useEffect, useState } from 'react';

function DashboardPatient() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer les infos de l'utilisateur connecté
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Mon Espace Patient</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Déconnexion
        </button>
      </div>

      {/* Carte de bienvenue */}
      <div style={styles.welcomeCard}>
        <h2>🧑‍🦱 Bonjour {user.prenom} {user.nom}</h2>
        <p>Email : {user.email}</p>
      </div>

      {/* Menu des fonctionnalités */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>🏥 Mon Dossier Médical</h3>
          <p>Consulter vos informations médicales</p>
          <button style={styles.button}>Voir mon dossier</button>
        </div>

        <div style={styles.card}>
          <h3>📅 Mes Rendez-vous</h3>
          <p>Voir vos prochains rendez-vous</p>
          <button style={styles.button}>Mes rendez-vous</button>
        </div>

        <div style={styles.card}>
          <h3>💊 Mes Médicaments</h3>
          <p>Liste de vos traitements en cours</p>
          <button style={styles.button}>Voir mes médicaments</button>
        </div>

        <div style={styles.card}>
          <h3>💉 Historique des séances</h3>
          <p>Vos séances de dialyse et soins</p>
          <button style={styles.button}>Voir l'historique</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    color: '#43a047',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  button: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#43a047',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default DashboardPatient;