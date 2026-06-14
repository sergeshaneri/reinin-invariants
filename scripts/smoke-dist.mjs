import { preview } from 'vite';

const basePath = '/reinin-invariants/';
const host = '127.0.0.1';
const port = 4173;
const fetchTimeoutMs = 5_000;
const shutdownTimeoutMs = 5_000;
const rootDivPattern = /<div\b[^>]*\bid=(["'])root\1[^>]*>/;

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Dist smoke failed: ${message}`);
  }
};

const fetchText = async (url) => {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });
    const text = await response.text();
    assert(text.length > 0, `${url} returned an empty response body`);
    return { response, text };
  } catch (error) {
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
      throw new Error(`Dist smoke failed: ${url} timed out after ${fetchTimeoutMs}ms`);
    }

    throw error;
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
      settle(new Error(`Dist smoke failed: preview server did not close within ${shutdownTimeoutMs}ms`));
    }, shutdownTimeoutMs);

    try {
      httpServer.close((error) => settle(error));
    } catch (error) {
      settle(error);
    }
  });
};

const server = await preview({
  configFile: 'vite.config.ts',
  configLoader: 'runner',
  preview: {
    host,
    port,
  },
  logLevel: 'silent',
});

try {
  const resolvedUrl = server.resolvedUrls?.local[0] ?? `http://${host}:${port}/`;
  const origin = new URL(resolvedUrl).origin;
  const pageUrl = new URL(basePath, `${origin}/`).toString();
  const { response: pageResponse, text: html } = await fetchText(pageUrl);

  assert(pageResponse.ok, `${pageUrl} returned ${pageResponse.status}`);
  assert(rootDivPattern.test(html), '#root mount point was not found');
  assert(!html.includes('/src/main.tsx'), 'HTML still points at the dev entrypoint');

  const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  const localRefs = refs.filter((ref) => ref.startsWith('/') && !ref.startsWith('//'));
  const assetRefs = localRefs.filter((ref) => ref.startsWith(`${basePath}assets/`));

  for (const ref of localRefs) {
    assert(ref.startsWith(basePath), `local reference "${ref}" does not use ${basePath}`);
  }

  assert(assetRefs.some((ref) => ref.endsWith('.js')), 'production JS asset was not found');
  assert(assetRefs.some((ref) => ref.endsWith('.css')), 'production CSS asset was not found');

  for (const ref of assetRefs) {
    const assetUrl = new URL(ref, origin).toString();
    const { response: assetResponse } = await fetchText(assetUrl);
    assert(assetResponse.ok, `${assetUrl} returned ${assetResponse.status}`);
  }

  console.log(`Dist smoke passed: ${pageUrl} served ${assetRefs.length} production assets under ${basePath}.`);
} finally {
  await closePreviewServer(server.httpServer);
}
