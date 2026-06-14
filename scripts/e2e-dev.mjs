import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const host = '127.0.0.1';
const port = 3002;
const shutdownTimeoutMs = 5_000;
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

const closeServer = async (server) => {
  await Promise.race([
    server.close(),
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`dev server did not close within ${shutdownTimeoutMs}ms`)),
        shutdownTimeoutMs,
      );
    }),
  ]);
};

const runPlaywright = async () => {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [playwrightBin, 'test'], {
      cwd: rootDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        PLAYWRIGHT_EXTERNAL_SERVER: '1',
      },
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Playwright exited with ${signal ?? code}`));
    });
  });
};

const playwrightBin = join(rootDir, 'node_modules', 'playwright', 'cli.js');

if (!existsSync(playwrightBin)) {
  throw new Error(`Playwright binary was not found at ${playwrightBin}`);
}

const server = await createServer({
  configFile: 'vite.config.ts',
  configLoader: 'runner',
  server: {
    host,
    port,
    strictPort: true,
  },
  logLevel: 'silent',
});

try {
  await server.listen();
  await runPlaywright();
} finally {
  await closeServer(server);
}
