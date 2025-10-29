import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config(); 

const dbUrl = process.env.DATABASE_URL;

console.log('DEBUG: DATABASE_URL present?', !!dbUrl);
if (!dbUrl) {
  console.error('\nERROR: DATABASE_URL is not set in process.env.');
  console.error('If you deploy on Railway: make sure DATABASE_URL is set for this environment (and available at build time if you run prisma generate during build).');
  process.exit(1);
}

try {
  console.log('Running: npx prisma generate');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl },
  });

  console.log('Prisma generate completed successfully.');
  console.log('Starting server...');
  import('./src/server.js'); 
} catch (err) {
  console.error('Start process failed:', err);
  process.exit(1);
}
