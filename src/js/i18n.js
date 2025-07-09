/**
 * Base URL.
 *
 * @type {string}
 */
const base = import.meta.env.BASE_URL || '/'

/**
 * Current language code used on the website.
 * @type {string}
 */
window.currentLang = 'en'

/**
 * List of supported language codes.
 * @type {string[]}
 */
export const supportedLangs = ['en', 'fr', 'de', 'es', 'pt', 'zh', 'ja']

/**
 * The key used to store language translations in sessionStorage.
 * @type {string}
 */
const CACHE_KEY = 'i18n-cache'

/**
 * Time-to-live (TTL) for cached translations in milliseconds.
 * After this duration, the cached translations are considered stale.
 * Currently set to 10 minutes.
 * @type {number}
 */
const CACHE_TTL = 10 * 60 * 1000

/**
 * Applies the given translations to all elements with
 * `data-i18n` and `data-i18n-placeholder` attributes.
 * For `data-i18n`, sets `textContent` or `innerHTML` based on content.
 * For `data-i18n-placeholder`, sets the placeholder attribute.
 *
 * @param {Object.<string,string>} translations
 */
export function applyTranslations(translations) {
  window.translations = translations

  // Apply translations for text content (supports HTML)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const translation = translations[key]
    if (!translation) return

    const hasHTML = /<\/?[a-z][\s\S]*>/i.test(translation) || /&[a-z]+;/.test(translation)
    if (hasHTML) {
      el.innerHTML = translation
    } else {
      el.textContent = translation
    }
  })

  // Apply translations for placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    const translation = translations[key]
    if (translation) {
      el.setAttribute('placeholder', translation)
    }
  })
}

/**
 * Get translations from cache (if valid).
 * @param {string} lang
 * @returns {Object|null}
 */
function getCachedTranslations(lang) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const cache = JSON.parse(raw)
    const entry = cache[lang]
    if (!entry) return null

    if (Date.now() - entry.timestamp > CACHE_TTL) return null
    return entry.translations
  } catch {
    return null
  }
}

/**
 * Store translations in sessionStorage cache.
 * @param {string} lang
 * @param {Object} translations
 */
function setCachedTranslations(lang, translations) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    const cache = raw ? JSON.parse(raw) : {}
    cache[lang] = {
      timestamp: Date.now(),
      translations,
    }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (err) {
    console.warn(`Failed to cache translations for "${lang}":`, err)
  }
}

/**
 * Clear i18n cache on page unload.
 */
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem(CACHE_KEY)
})

/**
 * Highlights the currently selected language button by
 * setting the `data-selected` attribute.
 *
 * @param {string} lang - The language code to highlight.
 */
function highlightSelectedLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.removeAttribute('data-selected')
    if (btn.getAttribute('data-lang') === lang) {
      btn.setAttribute('data-selected', 'true')
    }
  })
}

/**
 * Changes the website language to the specified `lang`,
 * fetches corresponding translation JSON,
 * applies translations, updates page title and URL,
 * and highlights the selected language button.
 *
 * @param {string} lang - Language code to switch to.
 * @returns {Promise<void>}
 */
export async function setLang(lang) {
  try {
    // Persist selected language in local storage
    localStorage.setItem('lang', lang)

    // Update the document's <html lang="..."> attribute
    document.documentElement.lang = lang

    // Load translations from cache or fetch from server
    let translations = getCachedTranslations(lang)

    if (!translations) {
      const res = await fetch(`${base}locales/${lang}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      translations = await res.json()
      setCachedTranslations(lang, translations)
    }

    // Apply translations to the current page
    applyTranslations(translations)

    // Store current language globally
    window.currentLang = lang

    // Set the document <title> using i18n key if available
    const titleEl = document.querySelector('title')
    const titleKey = titleEl?.getAttribute('data-i18n')
    if (titleEl) {
      if (titleKey && translations[titleKey]) {
        titleEl.textContent = translations[titleKey]
      } else if (translations['website.title']) {
        document.title = translations['website.title']
      }
    }

    // Update URL query param `?lang=xx` without reloading the page
    const url = new URL(window.location)
    url.searchParams.set('lang', lang)
    window.history.replaceState({}, '', url)

    // Visually highlight the selected language in the UI
    highlightSelectedLang(lang)
  } catch (err) {
    console.error(`Failed to load ${lang} translations:`, err)
  }
}

/**
 * Loads the initial language based on URL `lang` parameter,
 * then localStorage, falling back to English ('en').
 * Shows a loading indicator while fetching.
 *
 * @returns {Promise<void>}
 */
export async function loadInitialLanguage() {
  document.documentElement.setAttribute('data-loading', '')

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
