/// <reference types="@sveltejs/kit" />
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import houdini from 'houdini/vite';
import { resolve } from 'path';

const config: UserConfig = {
  plugins: [houdini(), sveltekit()],
  server: {
    port: 3000,
    strictPort: false
  },
  preview: {
    port: 4137,
    strictPort: false
  },
  resolve: {
    alias: {
      $src: resolve('.'),
      $assets: resolve('./src/assets'),
      $houdini: resolve('.', '$houdini')
    }
  },
  optimizeDeps: {
    exclude: ['extract-files']
  }
};

export default config;
