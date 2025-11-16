const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// ========== PATIENTS ==========

// Récupérer les patients d'un médecin
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
        u.email
      FROM patients p
      JOIN utilisateurs u ON p.utilisateur_id = u.id
      WHERE p.medecin_referent_id = $1
      ORDER BY p.nom, p.prenom;
    `, [medecinId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
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

// Récupérer toutes les séances d'un patient
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

// Ajouter une séance de dialyse
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
    
    // Calculer la durée en minutes
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