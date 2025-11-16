import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://medical-app-backend-msxq.onrender.com/api/patients';

function AjouterPatient({ onBack, onSuccess, medecinId }) {
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    sexe: 'M',
    groupe_sanguin: '',
    telephone: '',
    adresse: '',
    type_patient: 'prive',
    type_catheter: '',
    date_pose_catheter: '',
    numero_securite_sociale: '',
    personne_contact: '',
    tel_contact: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/nouveau`, {
        ...formData,
        medecin_referent_id: medecinId
      });

      alert('✅ Patient créé avec succès !');
      onSuccess();
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erreur lors de la création du patient');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Retour
        </button>
        <h1 style={styles.title}>➕ Ajouter un nouveau patient</h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Type de patient */}
        <div style={styles.section}>
          <h3>Type de patient</h3>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="type_patient"
                value="prive"
                checked={formData.type_patient === 'prive'}
                onChange={handleChange}
              />
              <span>🔒 Privé (uniquement vous)</span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="type_patient"
                value="public"
                checked={formData.type_patient === 'public'}
                onChange={handleChange}
              />
              <span>🏥 Public (tous les néphrologues)</span>
            </label>
          </div>
        </div>

        {/* Informations personnelles */}
        <div style={styles.section}>
          <h3>👤 Informations personnelles</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label>Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Date de naissance *</label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Sexe *</label>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Groupe sanguin</label>
              <input
                type="text"
                name="groupe_sanguin"
                value={formData.groupe_sanguin}
                onChange={handleChange}
                placeholder="Ex: A+"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>N° Sécurité Sociale</label>
              <input
                type="text"
                name="numero_securite_sociale"
                value={formData.numero_securite_sociale}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={styles.section}>
          <h3>📞 Contact</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Personne à contacter */}
        <div style={styles.section}>
          <h3>👨‍👩‍👧 Personne à contacter en cas d'urgence</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label>Nom complet</label>
              <input
                type="text"
                name="personne_contact"
                value={formData.personne_contact}
                onChange={handleChange}
                placeholder="Ex: Mohamed Bacha (frère)"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Téléphone</label>
              <input
                type="tel"
                name="tel_contact"
                value={formData.tel_contact}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Cathéter */}
        <div style={styles.section}>
          <h3>💉 Informations dialyse</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label>Type de cathéter</label>
              <select
                name="type_catheter"
                value={formData.type_catheter}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">-- Sélectionner --</option>
                <option value="Fistule artério-veineuse">Fistule artério-veineuse</option>
                <option value="Cathéter tunnelisé">Cathéter tunnelisé</option>
                <option value="Cathéter temporaire">Cathéter temporaire</option>
                <option value="Greffon artério-veineux">Greffon artério-veineux</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Date de pose</label>
              <input
                type="date"
                name="date_pose_catheter"
                value={formData.date_pose_catheter}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Mot de passe */}
        <div style={styles.section}>
          <h3>🔑 Identifiants de connexion</h3>
          <div style={styles.formGroup}>
            <label>Mot de passe *</label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Minimum 6 caractères"
              style={styles.input}
            />
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttons}>
          <button 
            type="button" 
            onClick={onBack}
            style={styles.cancelButton}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Création...' : '✅ Créer le patient'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
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
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
  },
  section: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  buttons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '12px 30px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  submitButton: {
    padding: '12px 30px',
    backgroundColor: '#1e88e5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default AjouterPatient;