const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// ========== RÉCUPÉRER LES PATIENTS ==========

// Récupérer les patients d'un médecin (privés + publics)
router.get('/medecin/:medecinId', async (req, res) => {
  try {
    const { medecinId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        p.id,
        p.nom,
        p.prenom,
        p.date_naissance,
        p.sexe,
        p.groupe_sanguin,
        p.telephone,
        p.adresse,
        p.type_patient,
        p.type_catheter,
        p.date_pose_catheter,
        u.email
      FROM patients p
      JOIN utilisateurs u ON p.utilisateur_id = u.id
      WHERE p.medecin_referent_id = $1 OR p.type_patient = 'public'
      ORDER BY p.type_patient DESC, p.nom, p.prenom;
    `, [medecinId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== AJOUTER UN NOUVEAU PATIENT ==========

router.post('/nouveau', async (req, res) => {
  try {
    const { 
      email,
      mot_de_passe,
      nom,
      prenom,
      date_naissance,
      sexe,
      groupe_sanguin,
      telephone,
      adresse,
      type_patient,
      type_catheter,
      date_pose_catheter,
      numero_securite_sociale,
      personne_contact,
      tel_contact,
      medecin_referent_id
    } = req.body;

    // 1. Créer l'utilisateur
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    
    const userResult = await pool.query(`
      INSERT INTO utilisateurs (email, mot_de_passe, role)
      VALUES ($1, $2, 'patient')
      RETURNING id;
    `, [email, hashedPassword]);
    
    const userId = userResult.rows[0].id;

    // 2. Créer le patient
    const patientResult = await pool.query(`
      INSERT INTO patients (
        utilisateur_id, nom, prenom, date_naissance, sexe, 
        groupe_sanguin, telephone, adresse, type_patient,
        type_catheter, date_pose_catheter, numero_securite_sociale,
        personne_contact, tel_contact, medecin_referent_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `, [
      userId, nom, prenom, date_naissance, sexe,
      groupe_sanguin, telephone, adresse, type_patient,
      type_catheter, date_pose_catheter, numero_securite_sociale,
      personne_contact, tel_contact, medecin_referent_id
    ]);

    res.json({ 
      success: true, 
      patient: patientResult.rows[0],
      message: 'Patient créé avec succès'
    });

  } catch (error) {
    console.error(error);
    
    if (error.code === '23505') { // Duplicate email
      return res.status(400).json({ error: 'Cet email existe déjà' });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== MALADIES ==========

router.get('/:patientId/maladies', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM maladies 
      WHERE patient_id = $1
      ORDER BY date_diagnostic DESC;
    `, [patientId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== MÉDICAMENTS ==========

router.get('/:patientId/medicaments', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM medicaments 
      WHERE patient_id = $1
      ORDER BY date_debut DESC;
    `, [patientId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== SÉANCES DE DIALYSE ==========

router.get('/:patientId/seances', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        s.*,
        m.nom as medecin_nom,
        m.prenom as medecin_prenom
      FROM seances_dialyse s
      LEFT JOIN medecins m ON s.medecin_id = m.id
      WHERE s.patient_id = $1
      ORDER BY s.date_entree DESC;
    `, [patientId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/:patientId/seances', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { 
      date_entree, 
      date_sortie, 
      poids_avant, 
      poids_apres, 
      tension_avant, 
      tension_apres, 
      notes, 
      medecin_id 
    } = req.body;
    
    const duree = date_sortie ? 
      Math.round((new Date(date_sortie) - new Date(date_entree)) / 60000) : null;
    
    const result = await pool.query(`
      INSERT INTO seances_dialyse (
        patient_id, date_entree, date_sortie, duree_minutes,
        poids_avant, poids_apres, tension_avant, tension_apres,
        notes, medecin_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `, [
      patientId, date_entree, date_sortie, duree,
      poids_avant, poids_apres, tension_avant, tension_apres,
      notes, medecin_id
    ]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== BILANS ==========

router.get('/:patientId/bilans', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM bilans 
      WHERE patient_id = $1
      ORDER BY date_examen DESC;
    `, [patientId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== RÉGIME ALIMENTAIRE ==========

router.get('/:patientId/regime', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM regime_alimentaire 
      WHERE patient_id = $1
      ORDER BY updated_at DESC
      LIMIT 1;
    `, [patientId]);
    
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== CONSULTATIONS ==========

router.get('/:patientId/consultations', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        c.*,
        m.nom as medecin_nom,
        m.prenom as medecin_prenom
      FROM consultations c
      LEFT JOIN medecins m ON c.medecin_id = m.id
      WHERE c.patient_id = $1
      ORDER BY c.date_consultation DESC;
    `, [patientId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;