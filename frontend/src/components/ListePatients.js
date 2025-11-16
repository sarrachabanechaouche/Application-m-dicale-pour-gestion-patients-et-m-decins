import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailPatient from './DetailPatient';

function ListePatients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `https://medical-app-backend-msxq.onrender.com/api/patients/medecin/${user.medecinId}`
      );
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedPatient(null);
  };

  if (showDetail && selectedPatient) {
    return <DetailPatient patient={selectedPatient} onBack={handleBack} />;
  }

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Mes Patients</h1>
        <button 
          onClick={() => window.location.href = '/'}
          style={styles.backButton}
        >
          ← Dashboard
        </button>
      </div>
      
      <div style={styles.patientsList}>
        {patients.length === 0 ? (
          <p style={styles.noPatients}>Aucun patient pour le moment</p>
        ) : (
          patients.map(patient => (
            <div 
              key={patient.id} 
              style={styles.patientCard}
              onClick={() => handleViewDetails(patient)}
            >
              <div style={styles.patientHeader}>
                <h3 style={styles.patientName}>
                  {patient.prenom} {patient.nom}
                </h3>
                <span style={styles.viewButton}>Voir le dossier →</span>
              </div>
              <div style={styles.patientInfo}>
                <span>📧 {patient.email}</span>
                <span>📞 {patient.telephone || 'N/A'}</span>
                <span>🩸 {patient.groupe_sanguin || 'N/A'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    color: '#1e88e5',
    margin: 0,
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  patientsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  noPatients: {
    textAlign: 'center',
    padding: '50px',
    color: '#666',
  },
  patientCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s',
    ':hover': {
      borderColor: '#1e88e5',
      transform: 'translateY(-2px)',
    }
  },
  patientHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  patientName: {
    margin: 0,
    color: '#333',
  },
  viewButton: {
    color: '#1e88e5',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  patientInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
};

export default ListePatients;