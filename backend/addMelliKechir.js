const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function addMelliKechir() {
  try {
    console.log('🚀 Ajout du Dr. Melli Kechir...');
    
    // Hash du mot de passe "melli123"
    const hashedPassword = await bcrypt.hash('melli123', 10);
    
    // Créer l'utilisateur
    const userResult = await pool.query(`
      INSERT INTO utilisateurs (email, mot_de_passe, role) 
      VALUES ('melli.kechir@hospital.dz', $1, 'medecin')
      RETURNING id;
    `, [hashedPassword]);
    
    const userId = userResult.rows[0].id;
    console.log(`✅ Utilisateur créé (ID: ${userId})`);
    
    // Créer le médecin
    await pool.query(`
      INSERT INTO medecins (utilisateur_id, nom, prenom, numero_rpps, specialite, telephone)
      VALUES ($1, 'Kechir', 'Melli', '98765432109', 'Médecine Générale', '0555123456');
    `, [userId]);
    
    console.log('✅ Dr. Melli Kechir ajouté avec succès ! 😂');
    console.log('\n📧 Email: melli.kechir@hospital.dz');
    console.log('🔑 Mot de passe: melli123');
    console.log('🏥 Spécialité: Médecine Générale\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

addMelliKechir();