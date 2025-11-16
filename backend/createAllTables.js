const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createAllTables() {
  try {
    console.log('🚀 Création de toutes les tables...\n');
    
    // Table des séances de dialyse
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seances_dialyse (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        date_entree TIMESTAMP NOT NULL,
        date_sortie TIMESTAMP,
        duree_minutes INTEGER,
        poids_avant DECIMAL(5,2),
        poids_apres DECIMAL(5,2),
        tension_avant VARCHAR(20),
        tension_apres VARCHAR(20),
        notes TEXT,
        medecin_id INTEGER REFERENCES medecins(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table seances_dialyse créée');

    // Table des bilans et examens
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bilans (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        type_bilan VARCHAR(100) NOT NULL,
        date_examen DATE NOT NULL,
        resultats TEXT,
        fichier_url VARCHAR(500),
        medecin_id INTEGER REFERENCES medecins(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table bilans créée');

    // Table du régime alimentaire
    await pool.query(`
      CREATE TABLE IF NOT EXISTS regime_alimentaire (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        aliments_autorises TEXT[],
        aliments_interdits TEXT[],
        restrictions_proteines VARCHAR(100),
        restrictions_potassium VARCHAR(100),
        restrictions_sodium VARCHAR(100),
        restrictions_liquides VARCHAR(100),
        notes TEXT,
        medecin_id INTEGER REFERENCES medecins(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table regime_alimentaire créée');

    // Table des consultations (déjà créée mais on s'assure)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        medecin_id INTEGER NOT NULL REFERENCES medecins(id),
        date_consultation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        motif TEXT,
        diagnostic TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table consultations créée');

    // Table pour les vidéos éducatives (placeholder)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS videos_educatives (
        id SERIAL PRIMARY KEY,
        titre VARCHAR(255) NOT NULL,
        description TEXT,
        url_video VARCHAR(500),
        categorie VARCHAR(100),
        duree_minutes INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table videos_educatives créée');

    // Table pour les cours (placeholder)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cours (
        id SERIAL PRIMARY KEY,
        titre VARCHAR(255) NOT NULL,
        description TEXT,
        contenu TEXT,
        categorie VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table cours créée');

    console.log('\n🎉 Toutes les tables ont été créées avec succès !\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

createAllTables();