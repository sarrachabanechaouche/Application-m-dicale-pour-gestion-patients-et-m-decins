const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function addBouchraB() {
  try {
    console.log('🚀 Ajout de Bouchra Bacha...');
    
    // Hash du mot de passe "bouchra123"
    const hashedPassword = await bcrypt.hash('bouchra123', 10);
    
    // Créer l'utilisateur
    const userResult = await pool.query(`
      INSERT INTO utilisateurs (email, mot_de_passe, role) 
      VALUES ('bouchra.bacha@patient.dz', $1, 'patient')
      RETURNING id;
    `, [hashedPassword]);
    
    const userId = userResult.rows[0].id;
    console.log(`✅ Utilisateur créé (ID: ${userId})`);
    
    // Récupérer l'ID de Dr. Melli Kechir
    const doctorResult = await pool.query(`
      SELECT m.id FROM medecins m
      JOIN utilisateurs u ON m.utilisateur_id = u.id
      WHERE u.email = 'melli.kechir@hospital.dz';
    `);
    
    const doctorId = doctorResult.rows[0]?.id || null;
    
    // Créer la patiente
    await pool.query(`
      INSERT INTO patients (utilisateur_id, nom, prenom, date_naissance, sexe, groupe_sanguin, telephone, medecin_referent_id)
      VALUES ($1, 'Bacha', 'Bouchra', '1990-03-20', 'F', 'O+', '0666123456', $2);
    `, [userId, doctorId]);
    
    console.log('✅ Bouchra Bacha ajoutée avec succès ! 😂');
    console.log(`✅ Médecin référent: Dr. Melli Kechir\n`);
    console.log('📧 Email: bouchra.bacha@patient.dz');
    console.log('🔑 Mot de passe: bouchra123');
    console.log('🩺 Date de naissance: 20/03/1990');
    console.log('🩸 Groupe sanguin: O+\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

addBouchraB();