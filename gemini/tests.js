gemini.suite('modal-types', (suite) => {
  suite.setUrl('/')
    .setCaptureElements('.swal2-modal')
    .capture('error', function (actions, find) {
      actions.click(find('.showcase.sweet button'))
      actions.wait(200)
    })
    .capture('question', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('.title-text button'))
      actions.wait(200)
    })
    .capture('success', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('.success button'))
      actions.wait(200)
    })
})

gemini.suite('input-types', (suite) => {
  suite.setUrl('/')
    .setCaptureElements('.swal2-modal')
    .capture('text', function (actions, find) {
      actions.click(find('#input-text button'))
      actions.sendKeys('Hola!')
      actions.wait(200)
    })
    .capture('email-invalid', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-email button'))
      actions.sendKeys('invalid email')
      actions.click(find('.swal2-confirm'))
      actions.sendKeys(gemini.TAB)
      actions.wait(200)
    })
    .capture('email-valid', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-email button'))
      actions.sendKeys('email@example.com')
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('url-invalid', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-url button'))
      actions.sendKeys('invalid URL')
      actions.click(find('.swal2-confirm'))
      actions.sendKeys(gemini.TAB)
      actions.wait(200)
    })
    .capture('url-valid', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-url button'))
      actions.sendKeys('https://www.youtube.com/watch?v=PWgvGjAhvIw')
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('password-dots', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-password button'))
      actions.sendKeys('passw0rd')
      actions.wait(200)
    })
    .capture('password', function (actions, find) {
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('textarea', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-textarea button'))
      actions.sendKeys("line 1 \n line 2")
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('select', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-select button'))
      actions.wait(200)
    })
    .capture('select-invalid', function (actions, find) {
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('select-valid', function (actions, find) {
      actions.sendKeys(gemini.DOWN)
      actions.sendKeys(gemini.DOWN)
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('radio', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-radio button'))
      actions.wait(2200)
    })
    .capture('radio-invalid', function (actions, find) {
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('radio-valid', function (actions, find) {
      actions.sendKeys(gemini.RIGHT)
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('checkbox', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-checkbox button'))
      actions.wait(200)
    })
    .capture('checkbox-invalid', function (actions, find) {
      actions.sendKeys(gemini.SPACE)
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('checkbox-valid', function (actions, find) {
      actions.sendKeys(gemini.SPACE)
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
    .capture('range', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#input-range button'))
      actions.wait(200)
    })
})

gemini.suite('custom-html', (suite) => {
  suite.setUrl('/')
    .setCaptureElements('.swal2-modal')
    .capture('custom-html', function (actions, find) {
      actions.click(find('.html button'))
      actions.wait(200)
    })
    .capture('bootstrap-buttons', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('#dismiss-handle button'))
      actions.wait(200)
    })
})

gemini.suite('ajax-request', (suite) => {
  suite.setUrl('/')
    .setCaptureElements('.swal2-modal')
    .capture('success', function (actions, find) {
      actions.click(find('.ajax-request button'))
      actions.wait(200)
      actions.sendKeys('email@example.com')
      actions.click(find('.swal2-confirm'))
      actions.wait(2200)
    })
    .capture('reject', function (actions, find) {
      actions.sendKeys(gemini.ESCAPE)
      actions.click(find('.ajax-request button'))
      actions.wait(200)
      actions.sendKeys('taken@example.com')
      actions.click(find('.swal2-confirm'))
      actions.wait(2000)
      actions.sendKeys(gemini.TAB)
      actions.wait(200)
    })
})

gemini.suite('chaining-modals', (suite) => {
  suite.setUrl('/')
    .setCaptureElements('.swal2-modal')
    .capture('step 1', function (actions, find) {
      actions.click(find('.chaining-modals button'))
      actions.sendKeys('uno')
      actions.sendKeys(gemini.TAB)
      actions.wait(200)
    })
    .capture('step 2', function (actions, find) {
      actions.click(find('.swal2-confirm'))
      actions.sendKeys('dos')
      actions.sendKeys(gemini.TAB)
      actions.wait(200)
    })
    .capture('step 3', function (actions, find) {
      actions.click(find('.swal2-confirm'))
      actions.sendKeys('tres')
      actions.sendKeys(gemini.TAB)
      actions.wait(200)
    })
    .capture('success', function (actions, find) {
      actions.click(find('.swal2-confirm'))
      actions.wait(200)
    })
})
