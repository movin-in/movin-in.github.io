import { loadInitialLanguage, setLang } from './i18n.js'
import {
  initHamburgerMenu,
  initLanguageMenu,
  initThemeToggle,
  initDownloadLink,
  initGitHubButton,
  updateFooterYear
} from './ui.js'

// Wait for DOM to be fully loaded before initializing the app
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load and apply the correct language based on ?lang or localStorage
    await loadInitialLanguage()

    // Initialize UI components
    initHamburgerMenu()        // Mobile nav toggle
    initLanguageMenu(setLang)  // Language dropdown logic
    initThemeToggle()          // Light/dark mode toggle
    initDownloadLink()         // Fetch latest mobile APK link
    updateFooterYear()         // Set current year in footer
    initGitHubButton()         // Load GitHub star button after DOM updates
  } catch (err) {
    console.error('Error during app initialization:', err)
  }
})
