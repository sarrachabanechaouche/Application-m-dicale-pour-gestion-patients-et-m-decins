const express = require('express');
const pool = require('../config/database');
const router = express.Router();

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

// Récupérer les maladies d'un patient
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

// Récupérer les médicaments d'un patient
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

module.exports = router;