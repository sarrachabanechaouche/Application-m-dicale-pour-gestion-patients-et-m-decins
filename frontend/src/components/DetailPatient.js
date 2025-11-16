import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://medical-app-backend-msxq.onrender.com/api/patients';

function DetailPatient({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState('maladies');
  const [maladies, setMaladies] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [seances, setSeances] = useState([]);
  const [bilans, setBilans] = useState([]);
  const [regime, setRegime] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, [patient.id]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les données en parallèle
      const [
        maladiesRes,
        medicamentsRes,
        seancesRes,
        bilansRes,
        regimeRes,
        consultationsRes
      ] = await Promise.all([
        axios.get(`${API_URL}/${patient.id}/maladies`),
        axios.get(`${API_URL}/${patient.id}/medicaments`),
        axios.get(`${API_URL}/${patient.id}/seances`),
        axios.get(`${API_URL}/${patient.id}/bilans`),
        axios.get(`${API_URL}/${patient.id}/regime`),
        axios.get(`${API_URL}/${patient.id}/consultations`)
      ]);

      setMaladies(maladiesRes.data);
      setMedicaments(medicamentsRes.data);
      setSeances(seancesRes.data);
      setBilans(bilansRes.data);
      setRegime(regimeRes.data);
      setConsultations(consultationsRes.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Retour
        </button>
        <h1 style={styles.title}>
          Dossier de {patient.prenom} {patient.nom}
        </h1>
      </div>

      {/* Infos patient */}
      <div style={styles.patientInfo}>
        <div style={styles.infoItem}>
          <strong>Date de naissance:</strong> {formatDate(patient.date_naissance)}
        </div>
        <div style={styles.infoItem}>
          <strong>Sexe:</strong> {patient.sexe}
        </div>
        <div style={styles.infoItem}>
          <strong>Groupe sanguin:</strong> {patient.groupe_sanguin}
        </div>
        <div style={styles.infoItem}>
          <strong>Téléphone:</strong> {patient.telephone || 'N/A'}
        </div>
        <div style={styles.infoItem}>
          <strong>Email:</strong> {patient.email}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button 
          style={{...styles.tab, ...(activeTab === 'maladies' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('maladies')}
        >
          📋 Maladies ({maladies.length})
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'medicaments' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('medicaments')}
        >
          💊 Médicaments ({medicaments.length})
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'seances' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('seances')}
        >
          💉 Séances ({seances.length})
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'bilans' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('bilans')}
        >
          🔬 Bilans ({bilans.length})
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'regime' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('regime')}
        >
          🍎 Régime
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'consultations' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('consultations')}
        >
          👨‍⚕️ Consultations ({consultations.length})
        </button>
      </div>

      {/* Contenu des tabs */}
      <div style={styles.tabContent}>
        {/* MALADIES */}
        {activeTab === 'maladies' && (
          <div>
            <h2>📋 Maladies</h2>
            {maladies.length === 0 ? (
              <p>Aucune maladie enregistrée</p>
            ) : (
              maladies.map(maladie => (
                <div key={maladie.id} style={styles.card}>
                  <h3>{maladie.nom_maladie}</h3>
                  <p>{maladie.description}</p>
                  <div style={styles.meta}>
                    <span>Diagnostic: {formatDate(maladie.date_diagnostic)}</span>
                    <span style={styles.badge}>{maladie.statut}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MÉDICAMENTS */}
        {activeTab === 'medicaments' && (
          <div>
            <h2>💊 Médicaments prescrits</h2>
            {medicaments.length === 0 ? (
              <p>Aucun médicament prescrit</p>
            ) : (
              medicaments.map(med => (
                <div key={med.id} style={styles.card}>
                  <h3>{med.nom_medicament}</h3>
                  <p><strong>Dosage:</strong> {med.dosage}</p>
                  <p><strong>Fréquence:</strong> {med.frequence}</p>
                  <div style={styles.meta}>
                    <span>Début: {formatDate(med.date_debut)}</span>
                    {med.date_fin && <span>Fin: {formatDate(med.date_fin)}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SÉANCES DE DIALYSE */}
        {activeTab === 'seances' && (
          <div>
            <h2>💉 Séances de dialyse</h2>
            {seances.length === 0 ? (
              <p>Aucune séance enregistrée</p>
            ) : (
              seances.map(seance => (
                <div key={seance.id} style={styles.card}>
                  <div style={styles.seanceHeader}>
                    <h3>Séance du {formatDateTime(seance.date_entree)}</h3>
                    {seance.duree_minutes && (
                      <span style={styles.badge}>
                        Durée: {seance.duree_minutes} min
                      </span>
                    )}
                  </div>
                  <div style={styles.seanceDetails}>
                    <div style={styles.seanceRow}>
                      <div>
                        <strong>Entrée:</strong> {formatDateTime(seance.date_entree)}
                      </div>
                      <div>
                        <strong>Sortie:</strong> {formatDateTime(seance.date_sortie)}
                      </div>
                    </div>
                    <div style={styles.seanceRow}>
                      <div>
                        <strong>Poids avant:</strong> {seance.poids_avant || 'N/A'} kg
                      </div>
                      <div>
                        <strong>Poids après:</strong> {seance.poids_apres || 'N/A'} kg
                      </div>
                    </div>
                    <div style={styles.seanceRow}>
                      <div>
                        <strong>Tension avant:</strong> {seance.tension_avant || 'N/A'}
                      </div>
                      <div>
                        <strong>Tension après:</strong> {seance.tension_apres || 'N/A'}
                      </div>
                    </div>
                    {seance.notes && (
                      <div style={styles.notes}>
                        <strong>Notes:</strong> {seance.notes}
                      </div>
                    )}
                    {seance.medecin_nom && (
                      <div style={styles.meta}>
                        Par Dr. {seance.medecin_prenom} {seance.medecin_nom}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* BILANS */}
        {activeTab === 'bilans' && (
          <div>
            <h2>🔬 Bilans et examens</h2>
            {bilans.length === 0 ? (
              <p>Aucun bilan enregistré</p>
            ) : (
              bilans.map(bilan => (
                <div key={bilan.id} style={styles.card}>
                  <h3>{bilan.type_bilan}</h3>
                  <p><strong>Date:</strong> {formatDate(bilan.date_examen)}</p>
                  {bilan.resultats && <p>{bilan.resultats}</p>}
                  {bilan.fichier_url && (
                    <a href={bilan.fichier_url} target="_blank" rel="noopener noreferrer">
                      📄 Voir le document
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* RÉGIME ALIMENTAIRE */}
        {activeTab === 'regime' && (
          <div>
            <h2>🍎 Régime alimentaire</h2>
            {!regime ? (
              <p>Aucun régime défini</p>
            ) : (
              <div style={styles.card}>
                <div style={styles.regimeSection}>
                  <h3>✅ Aliments autorisés</h3>
                  {regime.aliments_autorises && regime.aliments_autorises.length > 0 ? (
                    <ul>
                      {regime.aliments_autorises.map((aliment, idx) => (
                        <li key={idx}>{aliment}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Non défini</p>
                  )}
                </div>

                <div style={styles.regimeSection}>
                  <h3>❌ Aliments interdits</h3>
                  {regime.aliments_interdits && regime.aliments_interdits.length > 0 ? (
                    <ul>
                      {regime.aliments_interdits.map((aliment, idx) => (
                        <li key={idx}>{aliment}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Non défini</p>
                  )}
                </div>

                <div style={styles.regimeSection}>
                  <h3>🔬 Restrictions</h3>
                  <p><strong>Protéines:</strong> {regime.restrictions_proteines || 'Non défini'}</p>
                  <p><strong>Potassium:</strong> {regime.restrictions_potassium || 'Non défini'}</p>
                  <p><strong>Sodium:</strong> {regime.restrictions_sodium || 'Non défini'}</p>
                  <p><strong>Liquides:</strong> {regime.restrictions_liquides || 'Non défini'}</p>
                </div>

                {regime.notes && (
                  <div style={styles.regimeSection}>
                    <h3>📝 Notes</h3>
                    <p>{regime.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CONSULTATIONS */}
        {activeTab === 'consultations' && (
          <div>
            <h2>👨‍⚕️ Consultations</h2>
            {consultations.length === 0 ? (
              <p>Aucune consultation enregistrée</p>
            ) : (
              consultations.map(consult => (
                <div key={consult.id} style={styles.card}>
                  <h3>{formatDateTime(consult.date_consultation)}</h3>
                  {consult.motif && (
                    <p><strong>Motif:</strong> {consult.motif}</p>
                  )}
                  {consult.diagnostic && (
                    <p><strong>Diagnostic:</strong> {consult.diagnostic}</p>
                  )}
                  {consult.notes && (
                    <div style={styles.notes}>
                      <strong>Notes:</strong> {consult.notes}
                    </div>
                  )}
                  <div style={styles.meta}>
                    Par Dr. {consult.medecin_prenom} {consult.medecin_nom}
                  </div>
                </div>
              ))
            )}
          </div>
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
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  title: {
    color: '#1e88e5',
    margin: 0,
  },
  patientInfo: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  infoItem: {
    fontSize: '14px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  tabActive: {
    backgroundColor: '#1e88e5',
    color: 'white',
    borderColor: '#1e88e5',
  },
  tabContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    minHeight: '400px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #e0e0e0',
  },
  meta: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    gap: '15px',
  },
  badge: {
    backgroundColor: '#e3f2fd',
    color: '#1e88e5',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  seanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  seanceDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  seanceRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  notes: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fff3cd',
    borderRadius: '5px',
  },
  regimeSection: {
    marginBottom: '20px',
  },
};

export default DetailPatient;