import { createServer } from 'vite';

const host = '127.0.0.1';
const port = 3000;

const server = await createServer({
  configFile: 'vite.config.ts',
  configLoader: 'runner',
  server: {
    host,
    port,
    hmr: false,
  },
  logLevel: 'silent',
});

try {
  await server.listen();
  const serverUrl = server.resolvedUrls?.local[0] ?? `http://${host}:${port}/`;
  const response = await fetch(serverUrl);

  const html = await response.text();

  if (!response.ok) {
    throw new Error(`Smoke check failed: ${serverUrl} returned ${response.status}.`);
  }

  if (!html.includes('<div id="root"></div>')) {
    throw new Error('Smoke check failed: #root mount point was not found.');
  }

  console.log(`Smoke check passed: ${serverUrl} returned ${response.status}.`);
} finally {
  await server.close();
}
