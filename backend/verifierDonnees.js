const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifier() {
  try {
    console.log('\n🔍 VÉRIFICATION DES DONNÉES\n');
    
    // 1. Vérifier Dr. Melli
    const medecinResult = await pool.query(`
      SELECT m.id as medecin_id, m.nom, m.prenom, u.email
      FROM medecins m
      JOIN utilisateurs u ON m.utilisateur_id = u.id
      WHERE u.email = 'melli.kechir@hospital.dz';
    `);
    
    if (medecinResult.rows.length === 0) {
      console.log('❌ Dr. Melli non trouvé !');
      return;
    }
    
    const medecin = medecinResult.rows[0];
    console.log('✅ Dr. Melli trouvé:');
    console.log(`   ID Médecin: ${medecin.medecin_id}`);
    console.log(`   Nom: Dr. ${medecin.prenom} ${medecin.nom}`);
    console.log(`   Email: ${medecin.email}\n`);
    
    // 2. Vérifier Bouchra
    const patientResult = await pool.query(`
      SELECT p.id, p.nom, p.prenom, p.medecin_referent_id, u.email
      FROM patients p
      JOIN utilisateurs u ON p.utilisateur_id = u.id
      WHERE u.email = 'bouchra.bacha@patient.dz';
    `);
    
    if (patientResult.rows.length === 0) {
      console.log('❌ Bouchra non trouvée !');
      return;
    }
    
    const patient = patientResult.rows[0];
    console.log('✅ Bouchra trouvée:');
    console.log(`   ID Patient: ${patient.id}`);
    console.log(`   Nom: ${patient.prenom} ${patient.nom}`);
    console.log(`   Email: ${patient.email}`);
    console.log(`   Médecin référent ID: ${patient.medecin_referent_id}\n`);
    
    // 3. Vérifier le lien
    if (patient.medecin_referent_id === medecin.medecin_id) {
      console.log('✅ Bouchra est bien liée à Dr. Melli !');
    } else {
      console.log('❌ PROBLÈME : Bouchra n\'est PAS liée à Dr. Melli !');
      console.log(`   Médecin référent actuel: ${patient.medecin_referent_id}`);
      console.log(`   Devrait être: ${medecin.medecin_id}`);
      console.log('\n🔧 Correction en cours...');
      
      await pool.query(`
        UPDATE patients 
        SET medecin_referent_id = $1
        WHERE id = $2;
      `, [medecin.medecin_id, patient.id]);
      
      console.log('✅ Lien corrigé !');
    }
    
    // 4. Tous les patients de Dr. Melli
    const tousPatients = await pool.query(`
      SELECT p.nom, p.prenom, u.email
      FROM patients p
      JOIN utilisateurs u ON p.utilisateur_id = u.id
      WHERE p.medecin_referent_id = $1;
    `, [medecin.medecin_id]);
    
    console.log(`\n📋 Patients de Dr. Melli (${tousPatients.rows.length}) :`);
    tousPatients.rows.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.prenom} ${p.nom} (${p.email})`);
    });
    
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

verifier();