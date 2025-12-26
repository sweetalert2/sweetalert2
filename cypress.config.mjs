import cypress from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task.js'
import vitePreprocessor from 'cypress-vite'

export default cypress.defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)
      
      // Only use Vite preprocessor when coverage is enabled
      if (process.env.COVERAGE === 'true') {
        on('file:preprocessor', vitePreprocessor())
      }
      
      return config
    },
    supportFile: 'cypress/support/index.js',
    video: false,
    experimentalRunAllSpecs: true,
    experimentalWebKitSupport: true,
  },
})
