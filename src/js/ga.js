/**
 * Initialize Google Analytics with lazy loading on user interaction.
 * Loads the GA script only after the user interacts (mousemove or touchstart).
 *
 * @param {string} id - Your Google Analytics Measurement ID (e.g., 'G-XXXXXXX').
 */
export function initGA(id) {
  if (!id) {
    console.warn('Google Analytics ID is required')
    return
  }

  let loaded = false

  const loadAnalytics = () => {
    if (loaded) return
    loaded = true

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) }

    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    script.async = true
    script.onload = () => {
      window.gtag('js', new Date())
      window.gtag('config', id)
    }
    document.head.appendChild(script)
  }

  const startAnalytics = () => {
    window.removeEventListener('mousemove', startAnalytics)
    window.removeEventListener('touchstart', startAnalytics)
    loadAnalytics()
  }

  window.addEventListener('mousemove', startAnalytics, { once: true, passive: true })
  window.addEventListener('touchstart', startAnalytics, { once: true, passive: true })
}
