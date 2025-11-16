import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailPatient from './DetailPatient';
import AjouterPatient from './AjouterPatient';

function ListePatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAjouter, setShowAjouter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Filtres
  const [activeFilter, setActiveFilter] = useState(null); // null, 'tous', 'public', 'prive'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadPatients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activeFilter, searchTerm, patients]);

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

  const applyFilters = () => {
    if (!activeFilter) {
      setFilteredPatients([]);
      return;
    }

    let filtered = [...patients];

    // Filtre par type
    if (activeFilter === 'public') {
      filtered = filtered.filter(p => p.type_patient === 'public');
    } else if (activeFilter === 'prive') {
      filtered = filtered.filter(p => p.type_patient === 'prive');
    }
    // Si 'tous', on garde tous les patients

    // Recherche
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(search) ||
        p.prenom.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        (p.telephone && p.telephone.includes(search))
      );
    }

    setFilteredPatients(filtered);
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
    loadPatients();
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSearchTerm(''); // Réinitialiser la recherche
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

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  // Statistiques
  const totalPatients = patients.length;
  const patientsPublics = patients.filter(p => p.type_patient === 'public').length;
  const patientsPrives = patients.filter(p => p.type_patient === 'prive').length;

  return (
    <div style={styles.container}>
      {/* Header */}
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

      {/* Cartes de filtres */}
      <div style={styles.filterCards}>
        <div 
          style={{
            ...styles.filterCard,
            ...(activeFilter === 'tous' ? styles.filterCardActive : {})
          }}
          onClick={() => handleFilterChange('tous')}
        >
          <div style={styles.filterNumber}>{totalPatients}</div>
          <div style={styles.filterLabel}>📊 Total malades</div>
        </div>

        <div 
          style={{
            ...styles.filterCard,
            ...(activeFilter === 'public' ? styles.filterCardActive : {})
          }}
          onClick={() => handleFilterChange('public')}
        >
          <div style={styles.filterNumber}>{patientsPublics}</div>
          <div style={styles.filterLabel}>🏥 Malades publics</div>
        </div>

        <div 
          style={{
            ...styles.filterCard,
            ...(activeFilter === 'prive' ? styles.filterCardActive : {})
          }}
          onClick={() => handleFilterChange('prive')}
        >
          <div style={styles.filterNumber}>{patientsPrives}</div>
          <div style={styles.filterLabel}>🔒 Malades privés</div>
        </div>
      </div>

      {/* Barre de recherche - visible seulement si un filtre est actif */}
      {activeFilter && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Rechercher un patient (nom, prénom, email, téléphone)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={styles.clearButton}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Message d'instruction */}
      {!activeFilter && (
        <div style={styles.instructionBox}>
          <h3>👆 Sélectionnez une catégorie ci-dessus pour voir vos patients</h3>
          <p>Cliquez sur "Total malades", "Malades publics" ou "Malades privés"</p>
        </div>
      )}

      {/* Liste des patients filtrés */}
      {activeFilter && (
        <div style={styles.resultsSection}>
          <h2 style={styles.resultsTitle}>
            {activeFilter === 'tous' && `📊 Tous les patients (${filteredPatients.length})`}
            {activeFilter === 'public' && `🏥 Patients publics (${filteredPatients.length})`}
            {activeFilter === 'prive' && `🔒 Patients privés (${filteredPatients.length})`}
            {searchTerm && ` - Recherche: "${searchTerm}"`}
          </h2>

          {filteredPatients.length === 0 ? (
            <div style={styles.noResults}>
              {searchTerm ? (
                <p>Aucun patient trouvé pour "{searchTerm}"</p>
              ) : (
                <p>Aucun patient dans cette catégorie</p>
              )}
            </div>
          ) : (
            <div style={styles.patientsList}>
              {filteredPatients.map(patient => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  onView={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Composant carte patient
function PatientCard({ patient }) {
  return (
    <div 
      style={styles.patientCard}
      onClick={() => patient.onView && patient.onView(patient)}
    >
      <div style={styles.patientHeader}>
        <h3 style={styles.patientName}>
          {patient.prenom} {patient.nom}
          {patient.type_patient === 'public' && (
            <span style={styles.publicBadge}>PUBLIC</span>
          )}
          {patient.type_patient === 'prive' && (
            <span style={styles.priveBadge}>PRIVÉ</span>
          )}
        </h3>
      </div>
      <div style={styles.patientInfo}>
        <span>📧 {patient.email}</span>
        <span>📞 {patient.telephone || 'N/A'}</span>
        <span>🩸 {patient.groupe_sanguin || 'N/A'}</span>
        {patient.type_catheter && (
          <span>💉 {patient.type_catheter}</span>
        )}
      </div>
      <div style={styles.viewButtonContainer}>
        <span style={styles.viewButton}>Voir le dossier →</span>
      </div>
    </div>
  );
}

// Corriger la fonction PatientCard pour passer onView
function PatientCard({ patient, onView }) {
  return (
    <div 
      style={styles.patientCard}
      onClick={() => onView(patient)}
    >
      <div style={styles.patientHeader}>
        <h3 style={styles.patientName}>
          {patient.prenom} {patient.nom}
          {patient.type_patient === 'public' && (
            <span style={styles.publicBadge}>PUBLIC</span>
          )}
          {patient.type_patient === 'prive' && (
            <span style={styles.priveBadge}>PRIVÉ</span>
          )}
        </h3>
      </div>
      <div style={styles.patientInfo}>
        <span>📧 {patient.email}</span>
        <span>📞 {patient.telephone || 'N/A'}</span>
        <span>🩸 {patient.groupe_sanguin || 'N/A'}</span>
        {patient.type_catheter && (
          <span>💉 {patient.type_catheter}</span>
        )}
      </div>
      <div style={styles.viewButtonContainer}>
        <span style={styles.viewButton}>Voir le dossier →</span>
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
  filterCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  filterCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    border: '3px solid transparent',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  filterCardActive: {
    borderColor: '#1e88e5',
    backgroundColor: '#e3f2fd',
    transform: 'scale(1.05)',
  },
  filterNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#1e88e5',
    marginBottom: '10px',
  },
  filterLabel: {
    fontSize: '16px',
    color: '#666',
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '30px',
  },
  searchInput: {
    width: '100%',
    padding: '15px 50px 15px 20px',
    fontSize: '16px',
    border: '2px solid #1e88e5',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  clearButton: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666',
  },
  instructionBox: {
    backgroundColor: 'white',
    padding: '60px 20px',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#666',
  },
  resultsSection: {
    marginTop: '20px',
  },
  resultsTitle: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '20px',
  },
  noResults: {
    backgroundColor: 'white',
    padding: '60px 20px',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#666',
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
  },
  patientHeader: {
    marginBottom: '15px',
  },
  patientName: {
    margin: 0,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  publicBadge: {
    fontSize: '10px',
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
  },
  priveBadge: {
    fontSize: '10px',
    backgroundColor: '#9c27b0',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
  },
  patientInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
  },
  viewButtonContainer: {
    textAlign: 'right',
  },
  viewButton: {
    color: '#1e88e5',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default ListePatients;