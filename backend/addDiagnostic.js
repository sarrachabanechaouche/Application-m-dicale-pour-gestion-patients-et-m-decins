const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function addDiagnostic() {
  try {
    console.log('🏥 Création de la table maladies...');
    
    // Créer la table maladies si elle n'existe pas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS maladies (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        nom_maladie VARCHAR(255) NOT NULL,
        description TEXT,
        date_diagnostic DATE DEFAULT CURRENT_DATE,
        statut VARCHAR(50) DEFAULT 'active' CHECK (statut IN ('active', 'guerie', 'chronique'))
      );
    `);
    console.log('✅ Table maladies créée');
    
    // Récupérer l'ID de Bouchra Bacha
    const patientResult = await pool.query(`
      SELECT p.id FROM patients p
      JOIN utilisateurs u ON p.utilisateur_id = u.id
      WHERE u.email = 'bouchra.bacha@patient.dz';
    `);
    
    if (patientResult.rows.length === 0) {
      console.log('❌ Bouchra Bacha non trouvée. Lance d\'abord addBouchraB.js');
      return;
    }
    
    const patientId = patientResult.rows[0].id;
    
    // Ajouter le diagnostic légendaire 😂
    await pool.query(`
      INSERT INTO maladies (patient_id, nom_maladie, description, statut)
      VALUES ($1, 'Mal de dos', 'Da3at zahrat chababha 😭', 'chronique');
    `, [patientId]);
    
    console.log('✅ Diagnostic ajouté avec succès ! 😂');
    console.log('\n🩺 Patiente: Bouchra Bacha');
    console.log('📋 Maladie: Mal de dos');
    console.log('💔 Description: Da3at zahrat chababha 😭');
    console.log('📊 Statut: Chronique\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

addDiagnostic();