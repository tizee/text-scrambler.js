import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/text-scrambler.js'],
  globalName: 'TextScrambler',
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  format: ['esm', 'iife'],
  target: 'esnext',
  outDir: 'dist',
  dts: true,
  outExtension({ format }) {
    return {
      js: format === 'iife' ? '.js' : '.esm.js',
    }
  },
})
