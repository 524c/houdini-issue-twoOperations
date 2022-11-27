/* eslint-disable @typescript-eslint/naming-convention */
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),
  kit: {
    env: {
      dir: process.cwd(),
      publicPrefix: 'PUBLIC_'
    },
    adapter: adapter(),
    alias: {
      $houdini: './$houdini'
    }
  }
};

export default config;
