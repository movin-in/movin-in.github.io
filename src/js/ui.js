export function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger')
  const nav = document.querySelector('nav')

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true'
    hamburger.setAttribute('aria-expanded', !expanded)
    hamburger.classList.toggle('active')
    nav.classList.toggle('active')
  })
}

export function initHeaderScroll() {
  const header = document.querySelector('header')
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }
  })
}

export function initLanguageMenu(setLang) {
  const langToggle = document.getElementById('lang-toggle')
  const langMenu = document.getElementById('lang-menu')

  langToggle.addEventListener('click', () => {
    const expanded = langToggle.getAttribute('aria-expanded') === 'true'
    langToggle.setAttribute('aria-expanded', !expanded)
    langMenu.hidden = expanded
  })

  langMenu.querySelectorAll('button').forEach(item => {
    item.addEventListener('click', () => {
      const lang = item.getAttribute('data-lang')
      setLang(lang)
      langToggle.setAttribute('aria-expanded', false)
      langMenu.hidden = true
    })
  })

  document.addEventListener('click', (e) => {
    if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
      langToggle.setAttribute('aria-expanded', 'false')
      langMenu.hidden = true
    }
  })
}

export function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle')
  const iconSun = themeToggleBtn.querySelector('.icon-sun')
  const iconMoon = themeToggleBtn.querySelector('.icon-moon')

  function updateToggleIcon(theme) {
    if (theme === 'dark') {
      iconSun.style.display = 'block'
      iconMoon.style.display = 'none'
      themeToggleBtn.setAttribute('aria-pressed', 'true')
    } else {
      iconSun.style.display = 'none'
      iconMoon.style.display = 'block'
      themeToggleBtn.setAttribute('aria-pressed', 'false')
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
  updateToggleIcon(savedTheme)

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    updateToggleIcon(newTheme)
  })
}

export async function updateDownloadLink() {
  try {
    const url = 'https://raw.githubusercontent.com/aelassas/movinin/main/.github/latest-release.json'
    const cacheBustedUrl = `${url}?t=${Date.now()}`
    const res = await fetch(cacheBustedUrl)
    if (!res.ok) throw new Error('Failed to fetch latest release info')
    const data = await res.json()
    const link = document.getElementById('download-mobile-app')
    link.href = data.latestApkUrl
  } catch (err) {
    console.error(err)
    document.getElementById('demo-mobile-app').style.display = 'none'
  }
}

export function updateFooterYear() {
  document.getElementById('year').textContent = new Date().getFullYear()
}
