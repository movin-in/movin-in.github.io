[![deploy](https://github.com/movin-in/movin-in.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/movin-in/movin-in.github.io/actions/workflows/deploy.yml) [![lighthouse](https://github.com/movin-in/movin-in.github.io/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/movin-in/movin-in.github.io/actions/workflows/lighthouse.yml)

## About

[Movin' In](https://github.com/aelassas/movinin) is a modern rental property management platform offering a web frontend, native mobile apps (Android and iOS), and an admin panel.  

This repository contains the source code for the [Movin' In](https://movin-in.github.io/) official landing page — a presentation site for the platform, not the platform itself.

Built with a clean and simple design, this website presents the main features, demo, support, and contact sections to introduce Movin' In to users and developers.

The website is built using [Vite](https://vitejs.dev/) with plain HTML, CSS, and JavaScript.

Feel free to explore the code, see how everything works, suggest improvements, or use it as a starting point or template to build your own landing page.

## Website Features (Not Movin' In Platform)

- Multilingual support (English, French, German, Spanish, Portuguese, Japanese, Chinese)
- Responsive and accessible design  
- Language switcher and dark mode toggle  
- Demo links and contact form integration  
- Simple, clean, and modern UI built with Vite

## Separation of Concerns (SoC)

Each file/module has a single responsibility, helping keep the codebase clean and maintainable:

| File / Module        | Responsibility (Concern)                                      | Description                                                                 |
|----------------------|---------------------------------------------------------------|-----------------------------------------------------------------------------|
| `index.html`         | Structure / Content                                           | Defines the HTML structure and semantic layout of the page.                |
| `style.css`          | Presentation (Styling)                                        | Handles layout, colors, fonts, and responsive design using CSS.            |
| `i18n.js`            | Internationalization (i18n)                                   | Manages language loading, switching, and translation key resolution.       |
| `ga.js`              | Google Analytics                                              | Loads Google Analytics script on `mousemove` or `touchstart` to enhance performance by deferring third-party tracking until user interaction. |
| `ui.js`              | UI Behavior / Interactivity                                   | Manages dynamic UI features like header/footer loading, scroll effects, hamburger menu, theme toggle, etc. |
| `main.js`            | Application Initialization / Coordination                     | Initializes the app, connects modules together, and runs on DOM ready.     |
| `vite.config.js`     | Build Tool Configuration                                      | Configures how files are served and built using Vite.                      |
| `public/` folder     | Static Assets                                                 | Contains images, icons, and static resources directly served as-is.        |

By keeping each concern isolated in its own file, the project becomes easier to understand, test, and extend.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

Clone the repository:

```bash
git clone https://github.com/movin-in/movin-in.github.io.git
cd movin-in.github.io
```

Install dependencies:

```bash
npm install
```

### Development

Start the local development server with hot module replacement:

```bash
npm run dev
```

### Build

Build the static site for production:

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to be deployed.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is configured to be deployed on [GitHub Pages](https://pages.github.com/).

After building, push the `dist/` contents to the `gh-pages` branch or use GitHub Actions for automated deployment.

## Contributing

Contributions and suggestions are welcome. Feel free to open issues or pull requests.

Please keep changes focused and provide clear descriptions.

## License

This project is licensed under the MIT License.

## Links

* [Movin' In GitHub](https://github.com/aelassas/movinin)
* [Movin' In Live Demo](https://movin-in.github.io/#demo)
* [Documentation](https://github.com/aelassas/movinin/wiki)
