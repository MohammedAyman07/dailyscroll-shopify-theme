const fs = require('fs');

let rawTheme = fs.readFileSync('layout/theme.liquid', 'utf8');
let rawIndex = fs.readFileSync('templates/index.liquid', 'utf8');
let rawCollection = fs.readFileSync('templates/collection.liquid', 'utf8');
let rawManifesto = fs.readFileSync('templates/page.manifesto.liquid', 'utf8');
let appJs = fs.readFileSync('assets/app.js', 'utf8');

// --- 1. Clean theme.liquid (creates base theme layout) ---
let theme = rawTheme;
theme = theme.replace('{{ page_description | escape }}', 'Premium Curated Objects');
theme = theme.replace('{{ page_title }} - {{ shop.name }}', 'DailyScroll | Curated Objects');

// Replace asset_urls
theme = theme.replace(/{{\s*'([^']+)'\s*\|\s*asset_url\s*}}/g, './assets/$1');

// Simplify Logo
theme = theme.replace(/{% if settings.logo != blank %}[\s\S]*?{% else %}/, '');
theme = theme.replace(/{% endif %}/, '');
theme = theme.replace(/{% if settings.favicon != blank %}[\s\S]*?{% else %}/, '');
theme = theme.replace(/{% endif %}/, '');

// UPDATE NAVIGATION LINKS FOR VERCEL
theme = theme.replace(/{{ content_for_header }}/g, '');
theme = theme.replace(/{{ routes.root_url }}/g, '/index.html');
theme = theme.replace(/{{ routes.all_products_collection_url }}/g, '/collection.html');
theme = theme.replace(/\/pages\/manifesto/g, '/manifesto.html');
theme = theme.replace(/{{ routes.account_url }}/g, '#');
theme = theme.replace(/{{ routes.account_login_url }}/g, '#');
theme = theme.replace(/{{ routes.search_url }}/g, '#');

// Route the cart navbar button to open the sidebar instead of a page
theme = theme.replace(/onclick="window\.location\.href='{{ routes\.cart_url }}'"/g, 'onclick="openCart()"');

theme = theme.replace(/{{ cart.item_count }}/g, '0');
theme = theme.replace(/{{ shop.name \| escape }}/g, 'DailyScroll');
theme = theme.replace(/{{ shop.name \| upcase }}/g, 'DAILYSCROLL');
theme = theme.replace(/{{ 'now' \| date: '%Y' }}/g, '2026');
theme = theme.replace(/{% if customer %}/g, '');
theme = theme.replace(/{% for collection in collections limit:3 %}[\s\S]*?{% endfor %}/g, '');

// Inject missing Cart Sidebar HTML just before closing body
const cartDrawerHtml = `
  <div class="wishlist-overlay" id="cartOverlay" onclick="closeCart()"></div>
  <div class="wishlist-drawer" id="cartSidebar">
    <div class="wishlist-drawer-header">
      <div class="wishlist-drawer-title">— /// BAG</div>
      <button class="wishlist-close" onclick="closeCart()">✕</button>
    </div>
    <div class="wishlist-drawer-body">
      <div id="cartItems" style="display:flex; flex-direction:column; gap:1rem;"></div>
      <div id="cartFooter" style="margin-top:2rem; padding-top:1rem; border-top:1px solid #333; display:none;"></div>
    </div>
  </div>
`;
theme = theme.replace('</body>', cartDrawerHtml + '\n</body>');

// Fix global wishlist toggling links to go to product.html
theme = theme.replace(/<a href="' \+ p\.url \+ '"/g, '<a href="/product.html"');


// --- 2. Clean index.liquid (Homepage) ---
let index = rawIndex;
index = index.replace(/{{ 'now' \| date: '%Y' }}/g, '2026');
index = index.replace(/<!-- AD CAROUSEL SECTION -->[\s\S]*?<!-- NEW DROP SECTION -->/g, '<!-- NEW DROP SECTION -->');
let pStart = index.indexOf("{% assign featured_collection = collections['frontpage'] %}");
let pElse = index.indexOf("{% else %}", pStart);
if (pStart > -1 && pElse > -1) {
    index = index.substring(0, pStart) + index.substring(pElse + 10);
}
index = index.replace(/{% endif %}/g, '');
index = index.replace(/{{\s*'([^']+)'\s*\|\s*asset_url\s*}}/g, './assets/$1');
index = index.replace(/{{ routes.all_products_collection_url }}/g, '/collection.html');
index = index.replace(/{% form 'customer', class: 'newsletter-form' %}/g, '<form class="newsletter-form" onsubmit="handleNewsletter(event)">');
index = index.replace(/{% endform %}/g, '</form>');

// Update addToCart signatures to include image
index = index.replace(/addToCart\('dummy-1', 'Noise-Cancelling Headphones', 299\)/g, "addToCart('dummy-1', 'Noise-Cancelling Headphones', 299, './assets/product_headphones.png')");
index = index.replace(/addToCart\('dummy-2', 'Minimalist Desk Lamp', 129\)/g, "addToCart('dummy-2', 'Minimalist Desk Lamp', 129, './assets/product_lamp.png')");
index = index.replace(/addToCart\('dummy-3', 'Matte Black Chronograph', 195\)/g, "addToCart('dummy-3', 'Matte Black Chronograph', 195, './assets/product_watch.png')");
index = index.replace(/addToCart\('dummy-4', '360° Portable Speaker', 149\)/g, "addToCart('dummy-4', '360° Portable Speaker', 149, './assets/product_speaker.png')");


let indexHtml = theme.replace('{{ content_for_layout }}', index);
indexHtml = indexHtml.replace(/{{[^}]+}}/g, '').replace(/{%[^}]+%}/g, '');
fs.writeFileSync('index.html', indexHtml);


// --- 3. Clean collection.liquid (Shop) ---
let collection = rawCollection;
collection = collection.replace(/{{ collection.title \| upcase }}/g, 'ALL OBJECTS');
collection = collection.replace(/{{ collection.title \| escape }}/g, 'ALL OBJECTS');
collection = collection.replace(/{% if collection.description != blank %}[\s\S]*?{% endif %}/g, '');
collection = collection.replace(/{% for col in collections %}[\s\S]*?{% endfor %}/g, '');
// Fix the Ad carousel in collection page
let adCarouselReplacement = `
    <div class="ad-carousel-section" style="padding: 20px 5%;">
      <div class="ad-marquee-wrap">
        <div class="ad-marquee-track">
          <span>/// BEST SELLING</span><span>/// SHOP THE DROP NOW</span><span>/// LIMITED TIME OFFER</span>
          <span>/// BEST SELLING</span><span>/// SHOP THE DROP NOW</span><span>/// LIMITED TIME OFFER</span>
          <span>/// BEST SELLING</span><span>/// SHOP THE DROP NOW</span><span>/// LIMITED TIME OFFER</span>
        </div>
      </div>
      <div class="ad-carousel" id="adCarouselShop">
        <div class="ad-carousel-track" id="adTrackShop">
          <a href="/product.html" class="ad-slide">
            <div class="ad-slide-badge">★ BEST SELLING</div>
            <img src="./assets/product_headphones.png" alt="Ad 1" style="height:300px; object-fit:cover;">
          </a>
          <a href="/product.html" class="ad-slide">
            <div class="ad-slide-badge">★ BEST SELLING</div>
            <img src="./assets/product_watch.png" alt="Ad 2" style="height:300px; object-fit:cover;">
          </a>
          <a href="/product.html" class="ad-slide">
            <div class="ad-slide-badge">★ BEST SELLING</div>
            <img src="./assets/product_speaker.png" alt="Ad 3" style="height:300px; object-fit:cover;">
          </a>
        </div>
        <div class="ad-dots" id="adDotsShop"></div>
        <button class="ad-arrow ad-arrow-prev" onclick="adShopMove(-1)" aria-label="Previous">‹</button>
        <button class="ad-arrow ad-arrow-next" onclick="adShopMove(1)"  aria-label="Next">›</button>
      </div>
    </div>
    <script>
      (function(){
        var track = document.getElementById('adTrackShop');
        var dotsEl = document.getElementById('adDotsShop');
        var slides = track ? track.querySelectorAll('.ad-slide') : [];
        var total = slides.length, current = 0, timer;
        if (total <= 1) { document.querySelectorAll('#adCarouselShop .ad-arrow').forEach(function(a){ a.style.display='none'; }); }
        for (var i = 0; i < total; i++) {
          var dot = document.createElement('button');
          dot.className = 'ad-dot' + (i === 0 ? ' active' : '');
          dot.onclick = (function(idx){ return function(){ goToShop(idx); resetShop(); }; })(i);
          dotsEl.appendChild(dot);
        }
        function goToShop(idx) {
          current = (idx + total) % total;
          track.style.transform = 'translateX(-' + (current * 100) + '%)';
          dotsEl.querySelectorAll('.ad-dot').forEach(function(d,i){ d.classList.toggle('active', i===current); });
        }
        function resetShop() { clearInterval(timer); timer = setInterval(function(){ goToShop(current+1); }, 3000); }
        window.adShopMove = function(dir){ goToShop(current+dir); resetShop(); };
        resetShop();
      })();
    </script>
`;

// Extract everything before the ad carousel
let adStart = collection.indexOf("{% if settings.show_ad_shop");
// Find the end of the script tag that belongs to the ad carousel
let scriptEnd = collection.indexOf("</script>", adStart);
if (adStart > -1 && scriptEnd > -1) {
    // Find the {% endif %} that follows the script tag
    let adEnd = collection.indexOf("{% endif %}", scriptEnd);
    if (adEnd > -1) {
        collection = collection.substring(0, adStart) + adCarouselReplacement + collection.substring(adEnd + 11);
    }
}


let cStart = collection.indexOf("{% if collection.products.size > 0 %}");
let cElse = collection.indexOf("{% else %}", cStart);
if (cStart > -1 && cElse > -1) {
    collection = collection.substring(0, cStart) + collection.substring(cElse + 10);
}
collection = collection.replace(/{% endif %}/g, '');
collection = collection.replace(/{{\s*'([^']+)'\s*\|\s*asset_url\s*}}/g, './assets/$1');

collection = collection.replace(/addToCart\('dummy-1', 'Noise-Cancelling Headphones', 299\)/g, "addToCart('dummy-1', 'Noise-Cancelling Headphones', 299, './assets/product_headphones.png')");
collection = collection.replace(/addToCart\('dummy-2', 'Minimalist Desk Lamp', 129\)/g, "addToCart('dummy-2', 'Minimalist Desk Lamp', 129, './assets/product_lamp.png')");
collection = collection.replace(/addToCart\('dummy-3', 'Matte Black Chronograph', 195\)/g, "addToCart('dummy-3', 'Matte Black Chronograph', 195, './assets/product_watch.png')");
collection = collection.replace(/addToCart\('dummy-5', 'Designer Tech Sneakers', 210\)/g, "addToCart('dummy-5', 'Designer Tech Sneakers', 210, './assets/product_shoes.png')");


let collectionHtml = theme.replace('{{ content_for_layout }}', collection);
collectionHtml = collectionHtml.replace(/{{[^}]+}}/g, '').replace(/{%[^}]+%}/g, '');
fs.writeFileSync('collection.html', collectionHtml);


// --- 4. Clean page.manifesto.liquid (Manifesto) ---
let manifesto = rawManifesto;
manifesto = manifesto.replace(/{% if page.content != blank %}[\s\S]*?{% else %}/, '');
manifesto = manifesto.replace(/{% endif %}/, '');

let manifestoHtml = theme.replace('{{ content_for_layout }}', manifesto);
manifestoHtml = manifestoHtml.replace(/{{[^}]+}}/g, '').replace(/{%[^}]+%}/g, '');
fs.writeFileSync('manifesto.html', manifestoHtml);

// --- 5. Generate a generic product.html ---
let productContent = `
<section class="new-drop-section" style="padding-top:150px; min-height:80vh; max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:4rem; padding-left:5%; padding-right:5%;">
    <div style="background:#0a0a0a; border:1px solid #333; border-radius:12px; display:flex; align-items:center; justify-content:center; padding:2rem;">
        <img src="./assets/product_headphones.png" style="width:100%; filter:drop-shadow(0 20px 40px rgba(0,0,0,0.5));" id="prodMainImg">
    </div>
    <div style="display:flex; flex-direction:column; justify-content:center; gap:2rem;">
        <div>
            <div style="font-size:0.8rem; letter-spacing:0.2em; color:var(--accent); margin-bottom:1rem;">/// DAILYSCROLL EXCLUSIVE</div>
            <h1 style="font-family:'Barlow Condensed', sans-serif; font-size:4rem; font-weight:900; line-height:1; text-transform:uppercase;">Noise-Cancelling Headphones</h1>
            <div style="font-size:2rem; font-weight:700; margin-top:1rem;">$299.00</div>
        </div>
        <p style="color:#888; line-height:1.8;">Experience true silence and premium audio quality. These meticulously engineered headphones block out the noise of the world, allowing you to focus completely on the sound that matters. Includes 40-hour battery life and fast-charging.</p>
        
        <div style="display:flex; gap:1rem;">
            <button class="add-to-bag" style="flex:1; padding:1.2rem; font-size:1.1rem;" onclick="addToCart('dummy-1', 'Noise-Cancelling Headphones', 299, './assets/product_headphones.png')">ADD TO BAG</button>
            <button class="wishlist-heart-btn" onclick="toggleWishlist('dummy-1', 'Noise-Cancelling Headphones', '/product.html', './assets/product_headphones.png', this)" style="background:transparent; border:1px solid #333; border-radius:4px; padding:0 1.5rem; color:#fff; cursor:pointer; font-size:1.5rem;">♥</button>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; padding-top:2rem; border-top:1px solid #333;">
            <div><strong style="color:#fff;">Shipping:</strong> <span style="color:#888;">Free Worldwide</span></div>
            <div><strong style="color:#fff;">Returns:</strong> <span style="color:#888;">4-day Guarantee</span></div>
        </div>
    </div>
</section>
`;

let productHtml = theme.replace('{{ content_for_layout }}', productContent);
productHtml = productHtml.replace(/{{[^}]+}}/g, '').replace(/{%[^}]+%}/g, '');
fs.writeFileSync('product.html', productHtml);


// --- 6. Global Fixes for all HTML files ---
const files = ['index.html', 'collection.html', 'manifesto.html'];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Wrap standard dummy product images & overlay with anchor tag
    content = content.replace(
      /<div class="product-img-wrap">\s*<img src="\.\/assets\/([^"]+)" alt="([^"]+)" class="product-img" \/>\s*<div class="product-overlay"><span>VIEW OBJECT<\/span><\/div>\s*<\/div>/g,
      `<div class="product-img-wrap">
         <a href="/product.html" style="display:block; height:100%; width:100%;">
           <img src="./assets/$1" alt="$2" class="product-img" />
           <div class="product-overlay"><span>VIEW OBJECT</span></div>
         </a>
       </div>`
    );

    // 2. Wrap featured dummy product image & overlay with anchor tag
    content = content.replace(
      /<div class="product-img-wrap featured-img-wrap">\s*<img src="\.\/assets\/([^"]+)" alt="([^"]+)" class="product-img" \/>\s*<div class="product-overlay"><span>VIEW OBJECT<\/span><\/div>\s*<div class="featured-badge">FEATURED<\/div>\s*<\/div>/g,
      `<div class="product-img-wrap featured-img-wrap">
         <a href="/product.html" style="display:block; height:100%; width:100%;">
           <img src="./assets/$1" alt="$2" class="product-img" />
           <div class="product-overlay"><span>VIEW OBJECT</span></div>
           <div class="featured-badge">FEATURED</div>
         </a>
       </div>`
    );

    // 3. Wrap product title in anchor tag (if not already wrapped)
    content = content.replace(
      /<div><div class="product-name">([^<]+)<\/div><\/div>/g,
      `<div><a href="/product.html" style="text-decoration:none; color:inherit;"><div class="product-name">$1</div></a></div>`
    );

    fs.writeFileSync(file, content);
});

console.log('Full functioning static site compiled! Cart, Wishlist, Products, and Checkout simulated perfectly.');

console.log('Full functioning static site compiled! Cart, Wishlist, and Checkout simulated perfectly.');
