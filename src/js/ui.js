/**
 * Initializes the hamburger menu toggle.
 * Toggles the 'active' class on the hamburger button and the navigation menu,
 * updates the aria-expanded attribute for accessibility, and closes on outside click,
 * Escape key, or nav link click.
 */
export function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger')
  const nav = document.querySelector('nav')

  if (!hamburger || !nav) return

  const closeMenu = () => {
    hamburger.setAttribute('aria-expanded', 'false')
    hamburger.classList.remove('active')
    nav.classList.remove('active')
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation()
    const expanded = hamburger.getAttribute('aria-expanded') === 'true'
    hamburger.setAttribute('aria-expanded', !expanded)
    hamburger.classList.toggle('active')
    nav.classList.toggle('active')
  })

  // Close menu when clicking any navigation link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        closeMenu()
      }
    })
  })

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu()
    }
  })

  // Close menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu()
      hamburger.focus()
    }
  })
}

/**
 * Initializes the language selection menu.
 * Toggles the language menu visibility, sets the selected language,
 * and closes the menu when clicking outside.
 * 
 * @param {function(string): Promise<void>} setLang - Async function to change the app language.
 */
export function initLanguageMenu(setLang) {
  const langToggle = document.getElementById('lang-toggle')
  const langMenu = document.getElementById('lang-menu')
  const hamburger = document.querySelector('.hamburger')
  const nav = document.querySelector('nav')

  if (!langToggle || !langMenu) return

  langToggle.addEventListener('click', () => {
    const expanded = langToggle.getAttribute('aria-expanded') === 'true'
    langToggle.setAttribute('aria-expanded', !expanded)
    langMenu.hidden = expanded
  })

  langMenu.querySelectorAll('button').forEach(item => {
    item.addEventListener('click', async () => {
      const lang = item.getAttribute('data-lang')
      if (lang) {
        await setLang(lang)
      }
      langToggle.setAttribute('aria-expanded', 'false')
      langMenu.hidden = true

      // Also close mobile hamburger menu on language change
      if (hamburger && nav && nav.classList.contains('active')) {
        hamburger.setAttribute('aria-expanded', 'false')
        hamburger.classList.remove('active')
        nav.classList.remove('active')
      }
    })
  })

  document.addEventListener('click', (e) => {
    if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
      langToggle.setAttribute('aria-expanded', 'false')
      langMenu.hidden = true
    }
  })
}

/**
 * Initializes the light/dark theme toggle button.
 * Loads saved theme from localStorage and updates the UI accordingly.
 * Toggles between 'light' and 'dark' themes and updates localStorage.
 *
 */
export function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle')
  if (!themeToggleBtn) return

  const iconSun = themeToggleBtn.querySelector('.icon-sun')
  const iconMoon = themeToggleBtn.querySelector('.icon-moon')

  function updateToggleIcon(theme) {
    if (!iconSun || !iconMoon) return

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

/**
 * Updates the download link for the mobile Android app with the latest APK URL.
 * If the fetch fails, hides the demo mobile app section.
 */
async function updateDownloadLink() {
  try {
    const link = document.getElementById('download-mobile-app')
    if (!link) return
    const url = 'https://raw.githubusercontent.com/aelassas/movinin/main/.github/latest-release.json'
    const cacheBustedUrl = `${url}?t=${Date.now()}`
    const res = await fetch(cacheBustedUrl)
    if (!res.ok) throw new Error(`Failed to fetch latest release info: ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (link.href === data.latestApkUrl) return
    if (data.latestApkUrl) link.href = data.latestApkUrl
  } catch (err) {
    console.error(err)
    const demoMobileApp = document.getElementById('demo-mobile-app')
    if (demoMobileApp) demoMobileApp.style.display = 'none'
  }
}

/**
 * Initializes updating the mobile app download link.
 * Uses `requestIdleCallback` to defer the update until the browser is idle,
 * with a fallback to `setTimeout` if `requestIdleCallback` is not supported.
 */
export function initDownloadLink() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(updateDownloadLink)
  } else {
    setTimeout(updateDownloadLink, 100) // fallback
  }
}

/**
 * Loads the GitHub buttons script once the page has finished its own DOM updates
 * (translations, theme, etc.) and the browser is idle. The script reads layout, so
 * loading it while layout is dirty would cause a forced reflow.
 */
export function initGitHubButton() {
  if (!document.querySelector('.github-button')) return

  const load = () => {
    const script = document.createElement('script')
    script.src = 'https://buttons.github.io/buttons.js'
    script.async = true
    document.body.appendChild(script)
  }

  const onIdle = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(load, { timeout: 2000 })
    } else {
      setTimeout(load, 200)
    }
  }

  // Wait for a rendered frame so pending style/layout work is flushed first
  requestAnimationFrame(() => setTimeout(onIdle, 0))
}

/**
 * Updates the footer year element with the current year.
 */
export function updateFooterYear() {
  const yearElem = document.getElementById('year')
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear()
  }
}
