import { loadInitialLanguage, setLang } from './i18n.js'
import {
  initHamburgerMenu,
  initHeaderScroll,
  initLanguageMenu,
  initThemeToggle,
  updateDownloadLink,
  loadGitHubButtonsScript,
  initGitHubButton,
  updateFooterYear
} from './ui.js'

window.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadGitHubButtonsScript()
    await loadInitialLanguage()
    initHamburgerMenu()
    initHeaderScroll()
    initLanguageMenu(setLang)
    initThemeToggle()
    await updateDownloadLink()
    initGitHubButton()
    updateFooterYear()
  } catch (err) {
    console.error('Error during app initialization:', err)
  }
})
