# DailyScroll Black Theme

> A premium Shopify e-commerce theme combining Shopify Liquid, vanilla JavaScript, CSS, and Three.js/WebGL to create an immersive dark storefront experience.

**Live Demo:** https://dailyscroll-shopify-theme.vercel.app/

## About the Project

DailyScroll Black Theme is a custom e-commerce storefront designed around a minimal black aesthetic, interactive motion, and a high-end 3D hero experience.

The project has two related parts:

1. **Shopify theme source** — the primary implementation, written with Shopify Liquid and organized using Shopify's theme architecture.
2. **Static portfolio demo** — generated HTML used to deploy an interactive demonstration to Vercel without requiring a Shopify store or Shopify Partner access.

The Shopify Liquid files are the source implementation. The root-level `.html` files are generated/demo artifacts and are included so recruiters and other visitors can immediately experience the interface.

## Why I Built It

I wanted to explore how far a modern e-commerce interface could be pushed using the browser platform and Shopify's native theme architecture without depending on a large frontend framework.

The project focuses on:

- Interactive 3D graphics
- Lightweight client-side interactions
- Responsive UI design
- E-commerce-style cart and wishlist experiences
- Separation between Shopify source templates and the static portfolio demonstration

## Features

- **Interactive 3D Hero** — mouse-reactive black-chrome orb rendered with Three.js/WebGL.
- **Shopping Cart Drawer** — lightweight client-side cart interaction for the storefront experience.
- **Wishlist** — browser-side wishlist state using `localStorage`.
- **Scroll Animations** — viewport-based reveal animations using `IntersectionObserver`.
- **Parallax & Micro-interactions** — cursor tracking, hero parallax, product-card tilt, hover states, and animated UI feedback.
- **Responsive Layout** — layouts built with CSS Grid, Flexbox, fluid sizing, and responsive media queries.
- **Shopify Theme Architecture** — Liquid layouts, templates, configuration, and theme assets structured for Shopify.
- **Static Demo Pipeline** — a custom Node.js script converts the Shopify-oriented source into a self-contained portfolio demo for Vercel.

## Tech Stack

| Technology | Purpose |
|---|---|
| Shopify Liquid | Theme templates and Shopify storefront architecture |
| JavaScript (ES6+) | Client-side interactions and application logic |
| Three.js | 3D rendering and WebGL interactions |
| WebGL | Hardware-accelerated 3D graphics |
| HTML5 | Markup and static portfolio output |
| CSS3 | Responsive layouts, animations, and design system |
| Node.js | Static demo build/transformation script |
| Vercel | Live portfolio demonstration |

## Architecture

```text
Shopify Theme Source
│
├── layout/
│   └── theme.liquid          # Global theme wrapper
│
├── templates/                # Shopify page templates
│   ├── index.liquid
│   ├── product.liquid
│   ├── collection.liquid
│   └── ...
│
├── config/                   # Shopify theme configuration
│
└── assets/
    ├── app.js                # UI, cart, wishlist, animation logic
    ├── orb3d.js              # Three.js/WebGL implementation
    └── style.css             # Global styling

             │
             │ build.js
             ▼

Static Portfolio Demo
│
├── index.html
├── collection.html
├── product.html
└── manifesto.html
             │
             ▼
          Vercel
```

## Project Structure

```text
.
├── assets/
│   ├── app.js
│   ├── orb3d.js
│   ├── style.css
│   └── images/assets
├── config/
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/
│   └── theme.liquid
├── templates/
│   ├── index.liquid
│   ├── product.liquid
│   ├── collection.liquid
│   └── ...
├── build.js
├── index.html              # Generated static demo
├── collection.html         # Generated static demo
├── product.html            # Generated static demo
├── manifesto.html          # Generated static demo
├── .gitignore
├── LICENSE
└── README.md
```

## How the 3D Experience Works

The hero orb is implemented in `assets/orb3d.js` using Three.js.

The implementation includes:

- `WebGLRenderer` for hardware-accelerated rendering
- `SphereGeometry` for the main object
- `MeshPhysicalMaterial` for the black-chrome appearance
- Procedurally generated canvas-based environment imagery
- Environment lighting and multiple point lights
- Mouse-driven lighting and parallax
- Smooth animation using `requestAnimationFrame`
- Responsive renderer resizing

The 3D implementation is intentionally isolated from the main UI logic in `app.js`, making the two responsibilities easier to understand and maintain.

## Client-Side Interaction Architecture

`assets/app.js` handles the main browser interactions, including:

- Navigation state
- Cart state and rendering
- Wishlist-related UI
- Toast notifications
- Scroll reveal animations
- Product-card interactions
- Hero parallax
- Keyboard interactions

`IntersectionObserver` is used for scroll-reveal elements so the application does not need to continuously calculate element visibility on every scroll event.

## Static Portfolio Demo

Shopify Liquid normally depends on Shopify's storefront/runtime environment. To make the project immediately viewable by recruiters, `build.js` provides a separate demonstration pipeline.

The build script:

1. Reads selected Shopify Liquid source files.
2. Replaces Shopify-specific values that cannot exist outside Shopify.
3. Inserts controlled demo product data where required.
4. Converts selected Liquid templates into static HTML pages.
5. Writes the generated files used by the Vercel demonstration.

This means the static demo is **not a replacement for the Shopify theme source**. It is a portfolio presentation layer built from the same project.

## Shopify Installation

The primary project is structured as a Shopify theme.

Using Shopify CLI:

```bash
npm install -g @shopify/cli
shopify login --store your-store-name.myshopify.com
shopify theme dev
```

Alternatively, the theme source can be uploaded through Shopify Admin as a theme ZIP.

> The live Vercel demo is a static portfolio demonstration and does not provide a real Shopify checkout or production store backend.

## Performance Considerations

Performance was considered during the implementation rather than treating visual effects as the only priority.

Examples include:

- `IntersectionObserver` for viewport-based animations
- `requestAnimationFrame` for smooth animation loops
- Device pixel ratio limiting for the WebGL renderer
- Procedural environment generation instead of relying on a large external HDR environment asset
- Separation of the WebGL logic from general UI logic
- Native browser APIs instead of adding a large frontend framework for simple interactions

Actual performance can vary significantly by browser, device, GPU, network conditions, and Shopify configuration. No universal 60 FPS or Lighthouse score is claimed without a controlled benchmark.

## Accessibility Considerations

The interface includes several accessibility-oriented details, including:

- Keyboard interaction for important controls
- Escape-key handling for the cart drawer
- Semantic buttons and navigation controls where applicable
- Responsive layouts across screen sizes
- Reduced reliance on JavaScript for basic page structure

Further accessibility testing with automated and manual tools would be a useful future improvement.

## Security

This repository is intended to be public.

- No private API credentials or production secrets are intentionally included.
- Store-specific credentials should be provided through the Shopify CLI/authentication flow rather than committed to Git.
- Local and environment-specific files are excluded through `.gitignore` where appropriate.

## Testing & Quality

The project is primarily a frontend/theme project, so testing currently focuses on manual browser verification and source-level checks.

Future improvements could include:

- Shopify Theme Check in GitHub Actions
- Automated JavaScript tests for cart/wishlist logic
- Automated accessibility checks
- Lighthouse performance monitoring
- Cross-browser regression testing

## AI-Assisted Development Disclosure

AI tools were used as development assistants during parts of this project, including code exploration, debugging, implementation suggestions, refactoring ideas, and documentation support.

The final project was reviewed, integrated, tested, and adapted by the author. AI assistance was used as a productivity tool; the author is responsible for the final repository and its implementation.

## Key Engineering Takeaways

This project helped me strengthen practical skills in:

- Shopify theme development
- Vanilla JavaScript architecture
- Browser APIs and DOM manipulation
- WebGL and Three.js
- Interactive UI engineering
- Responsive CSS
- Client-side state management
- Performance-aware animation
- Static build pipelines
- Git/GitHub portfolio development

## Future Improvements

- Add automated Shopify Theme Check through GitHub Actions.
- Add automated tests for client-side state and cart behavior.
- Improve accessibility testing and reduced-motion support.
- Add more robust product/variant handling when connected to a real Shopify store.
- Measure WebGL and page performance across low-end mobile devices.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
