# DailyScroll Black Theme

**Live Demo:** https://dailyscroll-shopify-theme.vercel.app/

## About

This is a Shopify theme I built for a modern dark-style e-commerce website.

I wanted the website to feel different from a normal online store, so I added a 3D hero section, animations, product interactions, cart drawer and wishlist features.

The main project is the Shopify theme. I also made a static version of the site so I could host a working demo on Vercel and share it easily on GitHub.

## What I Built

- Dark e-commerce UI
- 3D interactive hero using Three.js
- Mouse movement and parallax effects
- Product card 3D hover effect
- Shopping cart drawer
- Wishlist using `localStorage`
- Scroll reveal animations
- Responsive design
- Shopify Liquid templates
- Static demo build using Node.js

## Technologies

- Shopify Liquid
- JavaScript (ES6+)
- Three.js / WebGL
- HTML5
- CSS3
- Node.js
- Vercel

## Project Structure

The important part of the project is the Shopify theme:

```text
assets/
├── app.js        # Main JavaScript
├── orb3d.js      # Three.js 3D orb
└── style.css     # Main styles

config/
├── settings_data.json
└── settings_schema.json

layout/
└── theme.liquid

templates/
├── index.liquid
├── product.liquid
├── collection.liquid
└── ...
```

There are also `.html` files in the root folder. These are generated files used for the live Vercel demo. The original Shopify code is inside the `.liquid` files.

## 3D Orb

The 3D orb is made with Three.js in `assets/orb3d.js`.

Some of the things I used are:

- WebGL renderer
- Sphere geometry
- Physical material
- Environment lighting
- Point lights
- Mouse movement
- Animation with `requestAnimationFrame`
- Responsive canvas resizing

I kept the 3D code in a separate file from the normal website JavaScript so it is easier to manage.

## JavaScript

Most of the website interactions are inside `assets/app.js`.

It handles things like:

- Cart
- Wishlist
- Navbar effects
- Scroll animations
- Product card effects
- Toast messages
- Parallax effects
- Keyboard controls

For the scroll animations I used `IntersectionObserver` instead of checking every element continuously while scrolling.

## Static Demo

Shopify Liquid needs Shopify to run the templates properly. Because I wanted recruiters to be able to open the project immediately, I created `build.js`.

The script takes parts of the Shopify theme and creates static HTML files for the demo.

The generated files are used by the Vercel website:

```text
build.js
   ↓
index.html
collection.html
product.html
manifesto.html
   ↓
Vercel
```

The Vercel version is only a demo. It does not have a real Shopify backend or real checkout.

## Run the Shopify Theme

If you have a Shopify development store, you can use Shopify CLI:

```bash
npm install -g @shopify/cli
shopify login --store your-store-name.myshopify.com
shopify theme dev
```

You can also upload the Shopify theme files to a Shopify store as a theme ZIP.

## Performance

I tried to keep the website lightweight even with the 3D effects.

Some things I used:

- `IntersectionObserver` for scroll animations
- `requestAnimationFrame` for animations
- Limited WebGL pixel ratio
- Procedural environment graphics for the 3D orb
- Native JavaScript instead of adding a large frontend framework

Performance will still depend on the device and browser, especially because WebGL is being used.

## Accessibility

I added some basic accessibility support, including:

- Keyboard controls for important interactions
- Escape key to close the cart
- Responsive layouts
- Buttons for interactive controls

There is still more accessibility testing I would like to add in the future.

## Security

No private API keys, passwords or production credentials are included in this repository.

Shopify login and store credentials should be handled through Shopify's normal authentication process and should not be committed to GitHub.

## Testing

This is mainly a frontend Shopify theme, so I currently test it by running the website and checking the main features in the browser.

I have not added a full automated test suite yet.

Some improvements I want to add later:

- Shopify Theme Check with GitHub Actions
- JavaScript tests for cart and wishlist
- Accessibility testing
- More browser testing
- Performance testing on lower-end phones

## AI Usage

I used AI tools during development as a coding assistant.

I used AI for things like finding bugs, getting implementation ideas, understanding some problems, refactoring suggestions and documentation.

I reviewed and changed the code during development and tested the project myself. I am responsible for the final code in this repository.

## What I Learned

While building this project I learned more about:

- Shopify Liquid
- JavaScript and DOM manipulation
- Three.js and WebGL
- Responsive CSS
- Browser APIs
- Client-side state using `localStorage`
- Animations and interactions
- Building a static demo from a Shopify project

## Future Improvements

- Add GitHub Actions with Shopify Theme Check
- Add automated tests
- Improve accessibility
- Add better Shopify product and variant handling
- Test the 3D experience on more mobile devices

## License

MIT License
