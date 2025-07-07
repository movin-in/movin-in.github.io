/**
 * Current language code used on the website.
 * @type {string}
 */
window.currentLang = 'en'

const base = import.meta.env.BASE_URL || '/'

/**
 * List of supported language codes.
 * @type {string[]}
 */
export const supportedLangs = ['en', 'fr', 'de', 'es', 'pt', 'zh', 'ja']

/**
 * Applies the given translations to all elements with
 * `data-i18n` and `data-i18n-placeholder` attributes.
 * For `data-i18n`, sets `textContent` or `innerHTML` based on content.
 * For `data-i18n-placeholder`, sets the placeholder attribute.
 *
 * @param {Object.<string,string>} translations - Key-value pairs of translation strings.
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
 * Highlights the currently selected language button by
 * setting the `data-selected` attribute.
 *
 * @param {string} lang - The language code to highlight.
 * @private
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
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang

    const res = await fetch(`locales/${lang}.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const translations = await res.json()
    applyTranslations(translations)

    window.currentLang = lang
    document.title = translations['website.title'] || document.title

    // Update URL query parameter without reloading page
    const url = new URL(window.location)
    url.searchParams.set('lang', lang)
    window.history.replaceState({}, '', url)

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

// On DOMContentLoaded, set language automatically based on URL or localStorage
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  const storedLang = localStorage.getItem('lang')

  const lang = supportedLangs.includes(urlLang) ? urlLang
    : supportedLangs.includes(storedLang) ? storedLang
      : 'en'

  setLang(lang)
})
