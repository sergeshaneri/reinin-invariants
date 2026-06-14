import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig(({mode}) => {
  const projectRoot = fileURLToPath(new URL('.', import.meta.url));

  return {
    root: projectRoot,
    base: mode === 'production' ? '/reinin-invariants/' : '/',
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      noDiscovery: true,
      include: [
        'react',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
        'motion/react',
        'lucide-react',
      ],
    },
    resolve: {
      alias: {
        '@': projectRoot,
      },
    },
    server: {
      fs: {
        allow: [projectRoot],
      },
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
