import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailPatient from './DetailPatient';
import AjouterPatient from './AjouterPatient';

function ListePatients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAjouter, setShowAjouter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(
        `https://medical-app-backend-msxq.onrender.com/api/patients/medecin/${userData.medecinId}`
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
    setShowAjouter(false);
    setSelectedPatient(null);
  };

  const handleAjouterPatient = () => {
    setShowAjouter(true);
  };

  const handlePatientCree = () => {
    setShowAjouter(false);
    loadPatients(); // Recharger la liste
  };

  // Afficher le formulaire d'ajout
  if (showAjouter) {
    return (
      <AjouterPatient 
        onBack={handleBack} 
        onSuccess={handlePatientCree}
        medecinId={user?.medecinId}
      />
    );
  }

  // Afficher les détails d'un patient
  if (showDetail && selectedPatient) {
    return <DetailPatient patient={selectedPatient} onBack={handleBack} />;
  }

  // Afficher la liste des patients
  if (loading) return <div style={styles.loading}>Chargement...</div>;

  // Séparer les patients publics et privés
  const patientsPrives = patients.filter(p => p.type_patient === 'prive');
  const patientsPublics = patients.filter(p => p.type_patient === 'public');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Mes Patients</h1>
        <div style={styles.headerButtons}>
          <button 
            onClick={handleAjouterPatient}
            style={styles.addButton}
          >
            ➕ Ajouter un patient
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            style={styles.backButton}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{patients.length}</div>
          <div style={styles.statLabel}>Total patients</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{patientsPrives.length}</div>
          <div style={styles.statLabel}>🔒 Privés</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{patientsPublics.length}</div>
          <div style={styles.statLabel}>🏥 Publics</div>
        </div>
      </div>

      {patients.length === 0 ? (
        <div style={styles.noPatients}>
          <p>Aucun patient pour le moment</p>
          <button onClick={handleAjouterPatient} style={styles.addButtonLarge}>
            ➕ Ajouter votre premier patient
          </button>
        </div>
      ) : (
        <>
          {/* Patients privés */}
          {patientsPrives.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>🔒 Mes patients privés ({patientsPrives.length})</h2>
              <div style={styles.patientsList}>
                {patientsPrives.map(patient => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onView={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Patients publics */}
          {patientsPublics.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>🏥 Patients publics ({patientsPublics.length})</h2>
              <div style={styles.patientsList}>
                {patientsPublics.map(patient => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onView={handleViewDetails}
                    isPublic={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Composant carte patient
function PatientCard({ patient, onView, isPublic }) {
  return (
    <div 
      style={styles.patientCard}
      onClick={() => onView(patient)}
    >
      <div style={styles.patientHeader}>
        <h3 style={styles.patientName}>
          {patient.prenom} {patient.nom}
          {isPublic && <span style={styles.publicBadge}>PUBLIC</span>}
        </h3>
        <span style={styles.viewButton}>Voir le dossier →</span>
      </div>
      <div style={styles.patientInfo}>
        <span>📧 {patient.email}</span>
        <span>📞 {patient.telephone || 'N/A'}</span>
        <span>🩸 {patient.groupe_sanguin || 'N/A'}</span>
        {patient.type_catheter && (
          <span>💉 {patient.type_catheter}</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    color: '#1e88e5',
    margin: 0,
  },
  headerButtons: {
    display: 'flex',
    gap: '10px',
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1e88e5',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  noPatients: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
  },
  addButtonLarge: {
    marginTop: '20px',
    padding: '15px 30px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '20px',
  },
  patientsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
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
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  publicBadge: {
    fontSize: '10px',
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '10px',
    fontWeight: 'bold',
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