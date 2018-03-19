const git = require('git-state')

function getGitStatus () {
  return new Promise((resolve) => {
    git.check(process.cwd(), (err, result) => {
      if (err) throw err
      resolve({
        currentBranch: result.branch,
        isCleanWorkingTree: !result.dirty && !result.untracked
      })
    })
  })
}

module.exports = getGitStatus
