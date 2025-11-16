const { Pool } = require('pg');

// Configuration Railway avec l'URL complète
const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  try {
    console.log('Connexion à Railway...');
    
    // Créer les tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        mot_de_passe VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('medecin', 'patient')),
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table utilisateurs créée');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS medecins (
        id SERIAL PRIMARY KEY,
        utilisateur_id INTEGER UNIQUE NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        numero_rpps VARCHAR(11) UNIQUE,
        specialite VARCHAR(100),
        telephone VARCHAR(20)
      );
    `);
    console.log('✅ Table medecins créée');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        utilisateur_id INTEGER UNIQUE NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        date_naissance DATE,
        sexe VARCHAR(10),
        groupe_sanguin VARCHAR(5),
        allergies TEXT,
        telephone VARCHAR(20),
        adresse TEXT,
        medecin_referent_id INTEGER REFERENCES medecins(id)
      );
    `);
    console.log('✅ Table patients créée');

    // Insérer les utilisateurs de test
    await pool.query(`
      INSERT INTO utilisateurs (email, mot_de_passe, role) 
      VALUES ('medecin@test.com', '$2b$10$2UZjw/hRbW2FXdSPhT0mBe9YRtkuRXEuFEEp/qAjYMNWxmXXtsACe', 'medecin')
      ON CONFLICT (email) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO utilisateurs (email, mot_de_passe, role) 
      VALUES ('patient@test.com', '$2b$10$Ye0pPNEI9fh4e4pfsK7f7.7xSivzwnvf8fzr05yjYpJik5rUx.F1a', 'patient')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Utilisateurs créés');

    await pool.query(`
      INSERT INTO medecins (utilisateur_id, nom, prenom, numero_rpps, specialite)
      VALUES (1, 'Dupont', 'Jean', '12345678901', 'Néphrologie')
      ON CONFLICT (utilisateur_id) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO patients (utilisateur_id, nom, prenom, date_naissance, sexe, groupe_sanguin, medecin_referent_id)
      VALUES (2, 'Martin', 'Marie', '1980-05-15', 'F', 'A+', 1)
      ON CONFLICT (utilisateur_id) DO NOTHING;
    `);
    console.log('✅ Médecin et patient créés');

    console.log('\n🎉 Base de données initialisée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

createTables();