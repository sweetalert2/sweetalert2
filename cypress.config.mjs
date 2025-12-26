import cypress from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task.js'

export default cypress.defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)
      return config
    },
    supportFile: 'cypress/support/index.js',
    video: false,
    experimentalRunAllSpecs: true,
    experimentalWebKitSupport: true,
  },
})
