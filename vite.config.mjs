import { defineConfig } from 'vite'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    istanbul({
      include: 'src/**/*.js',
      exclude: ['node_modules', 'cypress', 'test', 'dist'],
      extension: ['.js'],
      requireEnv: false,
      forceBuildInstrument: true,
    }),
  ],
  build: {
    // Don't minify for testing
    minify: false,
    sourcemap: true,
  },
  // Don't optimize dependencies during testing
  optimizeDeps: {
    disabled: false,
  },
})
