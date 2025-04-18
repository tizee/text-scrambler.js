import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['text-scrambler.js'],
  globalName: 'TextScrambler',
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  format: ['esm','iife'],
  target: 'esnext', // Target environment
  esbuildOptions(options) {
    options.footer = {
      js: `window.TextScrambler = TextScrambler.default || TextScrambler;`, // Ensures it is globally accessible
    };
  },
})
