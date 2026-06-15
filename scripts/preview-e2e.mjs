import { chromium } from '@playwright/test';
import { preview } from 'vite';

const basePath = '/reinin-invariants/';
const host = '127.0.0.1';
const port = 4173;
const shutdownTimeoutMs = 5_000;

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Production preview e2e failed: ${message}`);
  }
};

const closePreviewServer = async (httpServer) => {
  await new Promise((resolve, reject) => {
    let settled = false;

    const settle = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);

      if (error) {
        reject(error);
        return;
      }

      resolve();
    };

    const timer = setTimeout(() => {
      httpServer.closeAllConnections?.();
      httpServer.closeIdleConnections?.();
      settle(new Error(`preview server did not close within ${shutdownTimeoutMs}ms`));
    }, shutdownTimeoutMs);

    try {
      httpServer.close((error) => settle(error));
    } catch (error) {
      settle(error);
    }
  });
};

const expectVisible = async (locator, label) => {
  assert(await locator.isVisible(), `${label} is not visible`);
};

const server = await preview({
  configFile: 'vite.config.ts',
  configLoader: 'runner',
  preview: {
    host,
    port,
    strictPort: true,
  },
  logLevel: 'silent',
});

let browser;

try {
  const resolvedUrl = server.resolvedUrls?.local[0] ?? `http://${host}:${port}/`;
  const pageUrl = new URL(basePath, resolvedUrl).toString();
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  await page.goto(pageUrl);

  const rootText = await page.locator('#root').textContent();
  assert(rootText && rootText.length > 0, '#root is empty');
  await expectVisible(page.getByRole('heading', { level: 1 }), 'main heading');
  await expectVisible(page.getByRole('heading', { name: 'Признаки' }), 'traits heading');
  await expectVisible(page.getByRole('heading', { name: 'Аспектон' }), 'aspecton heading');
  await expectVisible(page.getByRole('heading', { name: 'Функцион' }), 'functionon heading');
  await expectVisible(page.locator('[data-trait-nav="vertness"]'), 'default trait button');
  await expectVisible(
    page.getByRole('button', { name: /Интуиция возможностей/ }),
    'default aspect button',
  );
  await expectVisible(page.getByRole('button', { name: /1 Базовая/ }), 'default function button');

  assert(errors.length === 0, `browser errors: ${errors.join('; ')}`);

  console.log(`Production preview e2e passed: ${pageUrl}`);
} finally {
  await browser?.close();
  await closePreviewServer(server.httpServer);
}
