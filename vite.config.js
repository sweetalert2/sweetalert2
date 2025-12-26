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
})
