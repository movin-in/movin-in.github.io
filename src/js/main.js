import { supportedLangs, setLang } from './i18n.js'
import {
  initHamburgerMenu,
  initHeaderScroll,
  initLanguageMenu,
  initThemeToggle,
  updateDownloadLink,
  updateFooterYear
} from './ui.js'

document.documentElement.setAttribute('data-loading', '')

async function loadInitialLanguage() {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  const storedLang = localStorage.getItem('lang')

  const lang = supportedLangs.includes(urlLang)
    ? urlLang
    : supportedLangs.includes(storedLang)
      ? storedLang
      : 'en'

  await setLang(lang)

  document.documentElement.removeAttribute('data-loading')
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadInitialLanguage()

  initHamburgerMenu()
  initHeaderScroll()
  initLanguageMenu(setLang)
  initThemeToggle()
  updateDownloadLink()
  updateFooterYear()
})
