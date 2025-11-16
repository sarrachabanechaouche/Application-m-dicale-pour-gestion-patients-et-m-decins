import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Veuillez sélectionner votre rôle');
      return;
    }

    try {
      const response = await axios.post('https://medical-app-backend-msxq.onrender.com/api/auth/login', {
        email,
        password,
        role,
      });

      // Stocker le token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Afficher les infos et rediriger
      alert(`Connexion réussie ! Bienvenue ${response.data.user.prenom} ${response.data.user.nom}`);
      onLoginSuccess(response.data.user.role);
      window.location.reload();
      
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Medical App</h1>
        <h2 style={styles.subtitle}>Connexion</h2>

        {/* Choix du rôle */}
        <div style={styles.roleContainer}>
          <button
            style={{
              ...styles.roleButton,
              ...(role === 'medecin' ? styles.roleButtonActive : {}),
            }}
            onClick={() => setRole('medecin')}
          >
            👨‍⚕️ Je suis Médecin
          </button>
          <button
            style={{
              ...styles.roleButton,
              ...(role === 'patient' ? styles.roleButtonActive : {}),
            }}
            onClick={() => setRole('patient')}
          >
            🧑‍🦱 Je suis Patient
          </button>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          {error && <p style={styles.error}>{error}</p>}
          
          <button type="submit" style={styles.submitButton}>
            Se connecter
          </button>
        </form>

        {/* Infos de test */}
        <div style={styles.testInfo}>
          <p style={styles.testTitle}>🧪 Comptes de test :</p>
          <p><strong>Médecin :</strong> medecin@test.com / admin123</p>
          <p><strong>Patient :</strong> patient@test.com / patient123</p>
        </div>
      </div>
    </div>
  );
}

// Styles CSS en JavaScript
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
  },
  title: {
    textAlign: 'center',
    color: '#1e88e5',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: '30px',
  },
  roleContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  roleButton: {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  roleButtonActive: {
    borderColor: '#1e88e5',
    backgroundColor: '#e3f2fd',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
  },
  submitButton: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#1e88e5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: '0',
  },
  testInfo: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    fontSize: '14px',
  },
  testTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default Login;