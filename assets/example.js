/* global XMLHttpRequest */
function makeApiRequest (endpoint) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', endpoint)
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject()
      }
    }
    xhr.send()
  })
}

var stats = {}

// latest release
makeApiRequest('https://api.github.com/repos/limonte/sweetalert2/releases/latest').then(
  (response) => {
    stats.latestRelease = response.tag_name
    showStats()
  },
  () => {}
)

// recent activity
makeApiRequest('https://api.github.com/repos/limonte/sweetalert2/commits').then(
  (response) => {
    var recentActivity = response[0].commit.author.date
    recentActivity = new Date(recentActivity)
    var today = new Date()
    var diffDays = parseInt((today - recentActivity) / (1000 * 60 * 60 * 24))
    switch (diffDays) {
      case 0: recentActivity = 'today'; break
      case 1: recentActivity = 'yesterday'; break
      default: recentActivity = diffDays + ' days ago'; break
    }
    stats.recentActivity = recentActivity
    showStats()
  },
  () => {}
)

// number of downloads last month
makeApiRequest('https://api.npmjs.org/downloads/point/last-month/sweetalert2').then(
  (response) => {
    stats.downloadsLastMonth = response.downloads.toLocaleString()
    showStats()
  },
  () => {}
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
