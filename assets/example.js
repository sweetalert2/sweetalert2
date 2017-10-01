/* global XMLHttpRequest */
function makeApiRequest (endpoint, desiredKey, array) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', endpoint)
    xhr.onload = function () {
      if (xhr.status === 200) {
        var json = JSON.parse(xhr.responseText)
        resolve(array ? json[0][desiredKey] : json[desiredKey])
      } else {
        reject()
      }
    }
    xhr.send()
  })
}

var stats = {}

// latest release
makeApiRequest('https://api.github.com/repos/limonte/sweetalert2/releases/latest', 'tag_name').then(
  function (latestRelease) {
    stats.latestRelease = latestRelease
    showStats()
  },
  function () {}
)

// recent activity
makeApiRequest('https://api.github.com/repos/limonte/sweetalert2/issues', 'updated_at', true).then(
  function (recentActivity) {
    recentActivity = new Date(recentActivity)
    var today = new Date()
    var diffDays = parseInt((today - recentActivity) / (1000 * 60 * 60 * 24))
    switch (diffDays) {
      case 0: recentActivity = 'today'; break
      case 1: recentActivity = 'yesterday'; break
      default: recentActivity = diffDays + 'days ago'; break
    }
    stats.recentActivity = recentActivity
    showStats()
  },
  function () {}
)

// number of downloads last month
makeApiRequest('https://api.npmjs.org/downloads/point/last-month/sweetalert2', 'downloads').then(
  function (downloadsLastMonth) {
    stats.downloadsLastMonth = downloadsLastMonth.toLocaleString()
    showStats()
  },
  function () {}
)

function showStats () {
  if (stats.latestRelease && stats.recentActivity && stats.downloadsLastMonth) {
    var currentVersion = document.getElementById('current-version')
    currentVersion.innerText = stats.latestRelease
    currentVersion.setAttribute('aria-label', currentVersion.getAttribute('aria-label') + stats.latestRelease)

    var latestUpdate = document.getElementById('latest-update')
    latestUpdate.innerText = stats.recentActivity
    latestUpdate.setAttribute('aria-label', latestUpdate.getAttribute('aria-label') + stats.recentActivity)

    var downloads = document.getElementById('downloads-last-month')
    downloads.innerText = stats.downloadsLastMonth
    downloads.setAttribute('aria-label', downloads.getAttribute('aria-label') + stats.downloadsLastMonth)

    document.getElementsByClassName('stats')[0].style.opacity = 1
  }
}
