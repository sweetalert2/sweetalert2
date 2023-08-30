import cypress from 'cypress'

export default cypress.defineConfig({
  e2e: {
    supportFile: 'cypress/support/index.js',
    video: false,
    experimentalRunAllSpecs: true,
    experimentalWebKitSupport: true,
  },
})
