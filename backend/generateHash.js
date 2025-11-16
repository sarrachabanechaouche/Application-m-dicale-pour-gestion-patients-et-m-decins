const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash1 = await bcrypt.hash('admin123', 10);
  const hash2 = await bcrypt.hash('patient123', 10);
  
  console.log('\n=== Hash générés ===\n');
  console.log('Médecin (admin123):');
  console.log(hash1);
  console.log('\nPatient (patient123):');
  console.log(hash2);
  console.log('\n');
}

generateHash();