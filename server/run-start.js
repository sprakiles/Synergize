import { execSync } from 'child_process';

try {
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma generate completed successfully.');

  console.log('Starting the server...');
  import('./src/server.js');

} catch (error) {
  console.error('An error occurred during the start process:', error);
  process.exit(1);
}