// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

const fetchStyles = (target, linkHref) => {
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.onload = resolve
    link.setAttribute('href', linkHref)
    target.appendChild(link)
  })
}

before(async () => {
  await fetchStyles(parent.document.head, '/cypress/styles.css')
  await fetchStyles(document.head, '/dist/sweetalert2.css')
})
