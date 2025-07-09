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

  const loadAnalytics = () => {
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      function gtag() { window.dataLayer.push(arguments) }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', id)
    }
  }

  const startAnalytics = () => {
    window.removeEventListener('mousemove', startAnalytics)
    window.removeEventListener('touchstart', startAnalytics)
    loadAnalytics()
  }

  window.addEventListener('mousemove', startAnalytics, { once: true })
  window.addEventListener('touchstart', startAnalytics, { once: true })
}
