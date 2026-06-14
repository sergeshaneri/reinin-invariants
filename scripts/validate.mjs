import { execSync } from 'node:child_process';

const checks = [
  'npm run lint',
  'npm test',
  'npm run build',
  'npm run smoke:dist',
  'npm run test:e2e:preview',
  'npm audit --audit-level=moderate',
  'npm run smoke:render',
  'npm run smoke',
  'npm run test:e2e',
];

for (const check of checks) {
  console.log(`\n== ${check} ==`);

  try {
    execSync(check, {
      stdio: 'inherit',
      shell: true,
    });
  } catch (error) {
    const code = typeof error.status === 'number' ? error.status : 1;
    console.error(`Validation failed: ${check} exited with ${code}.`);
    process.exit(code);
  }
}

console.log('\nAll validation checks passed.');
