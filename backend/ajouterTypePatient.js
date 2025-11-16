const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function ajouterTypePatient() {
  try {
    console.log('🔧 Modification de la table patients...\n');
    
    // Ajouter la colonne type_patient
    await pool.query(`
      ALTER TABLE patients 
      ADD COLUMN IF NOT EXISTS type_patient VARCHAR(20) DEFAULT 'prive' 
      CHECK (type_patient IN ('public', 'prive'));
    `);
    console.log('✅ Colonne type_patient ajoutée');
    
    // Ajouter colonne pour le cathéter
    await pool.query(`
      ALTER TABLE patients 
      ADD COLUMN IF NOT EXISTS type_catheter VARCHAR(100),
      ADD COLUMN IF NOT EXISTS date_pose_catheter DATE,
      ADD COLUMN IF NOT EXISTS numero_securite_sociale VARCHAR(50),
      ADD COLUMN IF NOT EXISTS personne_contact VARCHAR(255),
      ADD COLUMN IF NOT EXISTS tel_contact VARCHAR(20);
    `);
    console.log('✅ Colonnes supplémentaires ajoutées');
    
    // Mettre Bouchra en patient public (pour test)
    await pool.query(`
      UPDATE patients 
      SET type_patient = 'public'
      WHERE id = 2;
    `);
    console.log('✅ Bouchra mise en patient public\n');
    
    console.log('🎉 Modifications terminées !\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

ajouterTypePatient();