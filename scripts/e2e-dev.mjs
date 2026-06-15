import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const host = '127.0.0.1';
const port = 3002;
const shutdownTimeoutMs = 5_000;
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const appUrl = `http://${host}:${port}/reinin-invariants/`;
const viteClientMarker = '/@vite/client';
const appEntryMarker = '/src/main.tsx';

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

const isCurrentViteAppServer = async () => {
  try {
    const response = await fetch(appUrl, {
      signal: AbortSignal.timeout(2_000),
    });

    if (!response.ok) {
      return false;
    }

    const html = await response.text();

    return html.includes(viteClientMarker) && html.includes(appEntryMarker);
  } catch {
    return false;
  }
};

if (await isCurrentViteAppServer()) {
  console.log(`Reusing existing Vite dev server at ${appUrl}`);
  await runPlaywright();
  process.exit(0);
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
let serverStarted = false;

try {
  await server.listen();
  serverStarted = true;
  console.log(`Started Vite dev server at ${appUrl}`);
  await runPlaywright();
} catch (error) {
  if (error instanceof Error && error.message.includes(`Port ${port} is already in use`)) {
    throw new Error(
      `Port ${port} is already in use, but ${appUrl} is not a verified Vite dev server for this app. `
      + 'Free that port or confirm which process can be stopped, then rerun npm run test:e2e.',
    );
  }

  throw error;
} finally {
  if (serverStarted) {
    await closeServer(server);
  }
}
