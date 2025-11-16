const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const router = express.Router();

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Vérifier que tous les champs sont présents
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Chercher l'utilisateur dans la base
    const userResult = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1 AND role = $2',
      [email, role]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = userResult.rows[0];

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.mot_de_passe);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Récupérer les infos spécifiques (médecin ou patient)
    let userInfo;
    if (role === 'medecin') {
      const medecinResult = await pool.query(
        'SELECT * FROM medecins WHERE utilisateur_id = $1',
        [user.id]
      );
      userInfo = medecinResult.rows[0];
    } else {
      const patientResult = await pool.query(
        'SELECT * FROM patients WHERE utilisateur_id = $1',
        [user.id]
      );
      userInfo = patientResult.rows[0];
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Renvoyer le token et les infos utilisateur
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: userInfo.nom,
        prenom: userInfo.prenom,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;