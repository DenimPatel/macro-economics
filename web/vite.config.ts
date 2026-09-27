import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  base: '/macro-economics/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // `framer-motion` is the first dependency in this app that is pre-bundled
    // into its OWN chunk with its own copy of React, and the result is the
    // classic "Invalid hook call / Cannot read properties of null (reading
    // 'useContext')" on a cold `npm run dev`: two React instances, one on each
    // side of the `MotionConfig` boundary. The production build is unaffected —
    // Rollup has one `react` module — which is what makes it worth fixing
    // rather than shrugging at, since the failure only appears on the first
    // load after `npm install`, which is exactly when a new contributor starts.
    // `dedupe` forces every importer of these to resolve to one instance.
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom', 'framer-motion'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
