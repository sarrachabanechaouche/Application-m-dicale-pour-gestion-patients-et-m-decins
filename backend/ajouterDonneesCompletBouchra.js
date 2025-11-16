const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HPnOTQPRpXDbwJtYdutuzhlIXERkeTKx@switchyard.proxy.rlwy.net:57220/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function ajouterDonneesCompletBouchra() {
  try {
    console.log('🚀 Ajout des données complètes pour Bouchra Bacha...\n');
    
    // Récupérer les IDs
    const patientResult = await pool.query(`
      SELECT p.id FROM patients p
      JOIN utilisateurs u ON p.utilisateur_id = u.id
      WHERE u.email = 'bouchra.bacha@patient.dz';
    `);
    
    const doctorResult = await pool.query(`
      SELECT m.id FROM medecins m
      JOIN utilisateurs u ON m.utilisateur_id = u.id
      WHERE u.email = 'melli.kechir@hospital.dz';
    `);
    
    if (!patientResult.rows[0] || !doctorResult.rows[0]) {
      console.log('❌ Bouchra ou Dr. Melli non trouvés !');
      return;
    }
    
    const patientId = patientResult.rows[0].id;
    const doctorId = doctorResult.rows[0].id;
    
    console.log(`✅ Patient ID: ${patientId}, Médecin ID: ${doctorId}\n`);

    // ========== 1. SÉANCES DE DIALYSE ==========
    console.log('💉 Ajout des séances de dialyse...');
    
    const seances = [
      {
        date_entree: '2025-11-15 08:00:00',
        date_sortie: '2025-11-15 12:00:00',
        poids_avant: 68.5,
        poids_apres: 65.2,
        tension_avant: '140/90',
        tension_apres: '125/80',
        notes: 'Séance bien tolérée. Patiente en forme 💪'
      },
      {
        date_entree: '2025-11-13 08:00:00',
        date_sortie: '2025-11-13 12:00:00',
        poids_avant: 69.2,
        poids_apres: 66.0,
        tension_avant: '145/92',
        tension_apres: '130/82',
        notes: 'Légère fatigue en fin de séance'
      },
      {
        date_entree: '2025-11-11 14:00:00',
        date_sortie: '2025-11-11 18:00:00',
        poids_avant: 70.0,
        poids_apres: 66.5,
        tension_avant: '142/88',
        tension_apres: '128/81',
        notes: 'RAS - Séance standard'
      },
      {
        date_entree: '2025-11-08 08:00:00',
        date_sortie: '2025-11-08 12:00:00',
        poids_avant: 68.8,
        poids_apres: 65.5,
        tension_avant: '138/86',
        tension_apres: '124/78',
        notes: 'Bonne récupération'
      },
      {
        date_entree: '2025-11-06 08:00:00',
        date_sortie: '2025-11-06 12:00:00',
        poids_avant: 69.5,
        poids_apres: 66.2,
        tension_avant: '141/89',
        tension_apres: '127/80',
        notes: 'Patiente discute avec les infirmières, moral au top 😊'
      }
    ];

    for (const seance of seances) {
      const duree = Math.round((new Date(seance.date_sortie) - new Date(seance.date_entree)) / 60000);
      
      await pool.query(`
        INSERT INTO seances_dialyse (
          patient_id, date_entree, date_sortie, duree_minutes,
          poids_avant, poids_apres, tension_avant, tension_apres,
          notes, medecin_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT DO NOTHING;
      `, [
        patientId, seance.date_entree, seance.date_sortie, duree,
        seance.poids_avant, seance.poids_apres, 
        seance.tension_avant, seance.tension_apres,
        seance.notes, doctorId
      ]);
    }
    console.log(`✅ ${seances.length} séances de dialyse ajoutées\n`);

    // ========== 2. BILANS ET EXAMENS ==========
    console.log('🔬 Ajout des bilans...');
    
    await pool.query(`
      INSERT INTO bilans (patient_id, type_bilan, date_examen, resultats, medecin_id)
      VALUES 
        ($1, 'Bilan sanguin complet', '2025-11-10', 'Créatinine: 8.2 mg/dL, Urée: 180 mg/dL, Potassium: 5.1 mmol/L - Valeurs stables', $2),
        ($1, 'Échographie rénale', '2025-10-25', 'Reins de petite taille, échogènes. Pas de dilatation des voies excrétrices.', $2),
        ($1, 'ECG', '2025-10-15', 'Rythme sinusal normal. Pas d''anomalie détectée.', $2),
        ($1, 'Radiographie thoracique', '2025-09-30', 'Pas de cardiomégalie. Champs pulmonaires clairs.', $2)
      ON CONFLICT DO NOTHING;
    `, [patientId, doctorId]);
    console.log('✅ Bilans ajoutés\n');

    // ========== 3. RÉGIME ALIMENTAIRE ==========
    console.log('🍎 Ajout du régime alimentaire...');
    
    await pool.query(`
      INSERT INTO regime_alimentaire (
        patient_id, 
        aliments_autorises, 
        aliments_interdits,
        restrictions_proteines,
        restrictions_potassium,
        restrictions_sodium,
        restrictions_liquides,
        notes,
        medecin_id
      ) VALUES (
        $1,
        ARRAY['Pommes', 'Poires', 'Raisin', 'Riz blanc', 'Pain blanc', 'Poulet', 'Poisson blanc', 'Concombre', 'Laitue'],
        ARRAY['Bananes', 'Oranges', 'Tomates', 'Épinards', 'Pommes de terre', 'Chocolat', 'Produits laitiers', 'Charcuterie', 'Aliments en conserve'],
        'Max 1g/kg/jour',
        'Limiter à 2000mg/jour',
        'Max 2000mg/jour (pas de sel ajouté)',
        'Max 1L/jour',
        'Régime adapté pour insuffisance rénale chronique. Bien respecter les restrictions en potassium et sodium. Peser les aliments si possible.',
        $2
      )
      ON CONFLICT DO NOTHING;
    `, [patientId, doctorId]);
    console.log('✅ Régime alimentaire ajouté\n');

    // ========== 4. CONSULTATIONS SUPPLÉMENTAIRES ==========
    console.log('👨‍⚕️ Ajout de consultations...');
    
    await pool.query(`
      INSERT INTO consultations (patient_id, medecin_id, date_consultation, motif, diagnostic, notes)
      VALUES 
        ($1, $2, '2025-11-12 10:30:00', 'Suivi mensuel dialyse', 'Évolution favorable', 'Bonne adaptation au traitement. Continuer le protocole actuel. Revoir dans 1 mois.'),
        ($1, $2, '2025-10-15 14:00:00', 'Contrôle bilan sanguin', 'Résultats stables', 'Les paramètres biologiques sont dans les normes attendues. Poursuivre le traitement.'),
        ($1, $2, '2025-09-20 09:00:00', 'Consultation initiale dialyse', 'Mise en dialyse', 'Patiente bien informée du protocole. Première séance programmée. Support psychologique proposé.')
      ON CONFLICT DO NOTHING;
    `, [patientId, doctorId]);
    console.log('✅ Consultations ajoutées\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 DOSSIER COMPLET DE BOUCHRA BACHA 🎉');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ 5 séances de dialyse avec détails complets');
    console.log('✅ 4 bilans et examens médicaux');
    console.log('✅ Régime alimentaire détaillé');
    console.log('✅ 3 consultations médicales');
    console.log('✅ 3 maladies (déjà ajoutées)');
    console.log('✅ 4 médicaments (déjà ajoutés)');
    console.log('\n🔑 Connexion:');
    console.log('   Dr. Melli: melli.kechir@hospital.dz / melli123');
    console.log('   Bouchra: bouchra.bacha@patient.dz / bouchra123');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

ajouterDonneesCompletBouchra();