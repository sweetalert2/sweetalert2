#!/usr/bin/env node

if (!process.env.SUPPRESS_SUPPORT) {
  const ANSI_RESET = '\u001b[0m'
  const ANSI_GREEN = '\u001b[32m'
  const ANSI_YELLOW = '\u001b[33m'
  const ANSI_BLUE = '\u001b[96m'
  const ANSI_WHITE = '\u001b[37m'
  const ANSI_BOLD = '\u001b[1m'

  console.log( // eslint-disable-line
    ANSI_GREEN +
    'Has SweetAlert2 helped you create amazing applications?\n' +
    'You can show your' + ANSI_YELLOW + ' <3 ' + ANSI_GREEN + 'and support by making a donation:\n' +
    ANSI_WHITE + ' > ' +
    ANSI_BLUE + ANSI_BOLD + 'https://sweetalert2.github.io/#donations\n' +
    ANSI_RESET
  )
}
