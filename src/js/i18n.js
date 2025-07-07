window.currentLang = 'en'

const base = import.meta.env.BASE_URL || '/'

export const supportedLangs = ['en', 'fr', 'es', 'pt', 'zh', 'ja']

export function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (translations[key]) {
      el.textContent = translations[key]
    }
  })

  // Support placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    const translation = translations[key]
    if (translation) {
      el.setAttribute('placeholder', translation)
    }
  })

  const defaultLang = 'en'

  // Get saved language from localStorage or fallback to default
  const lang = localStorage.getItem('lang') || defaultLang

  // Build hrefs
  fetch(`${base}locales/${lang}.json`)
    .then(res => res.json())
    .then(translations => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n')
        const translation = translations[key]
        if (!translation) return

        // Check if translation includes any HTML tag (like <a>, <strong>, etc.)
        const hasHTML = /<\/?[a-z][\s\S]*>/i.test(translation)

        if (hasHTML) {
          el.innerHTML = translation
        } else {
          el.textContent = translation
        }
      })
    })
    .catch(err => console.error(`Failed to load ${lang} translations`, err))
}

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

    // Update URL without reloading
    const url = new URL(window.location)
    url.searchParams.set('lang', lang)
    window.history.replaceState({}, '', url)

    // Highlight selected language button
    const buttons = document.querySelectorAll('[data-lang]')
    buttons.forEach(btn => {
      btn.removeAttribute('data-selected')
      if (btn.getAttribute('data-lang') === lang) {
        btn.setAttribute('data-selected', 'true')
      }
    })
  } catch (err) {
    console.error(`Failed to load ${lang} translations:`, err)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  const storedLang = localStorage.getItem('lang')

  const lang = supportedLangs.includes(urlLang) ? urlLang
    : supportedLangs.includes(storedLang) ? storedLang
      : 'en'

  setLang(lang)
})
