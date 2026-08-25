const fs = require('fs');

let rawTheme = fs.readFileSync('layout/theme.liquid', 'utf8');
let rawIndex = fs.readFileSync('templates/index.liquid', 'utf8');
let rawCollection = fs.readFileSync('templates/collection.liquid', 'utf8');
let rawManifesto = fs.readFileSync('templates/page.manifesto.liquid', 'utf8');

// --- 1. Clean theme.liquid (creates base theme layout) ---
let theme = rawTheme;
theme = theme.replace('{{ page_description | escape }}', 'Premium Curated Objects');
theme = theme.replace('{{ page_title }} - {{ shop.name }}', 'DailyScroll | Curated Objects');

// Replace asset_urls
theme = theme.replace(/{{\s*'([^']+)'\s*\|\s*asset_url\s*}}/g, './assets/$1');

// Simplify Logo
theme = theme.replace(/{% if settings.logo != blank %}[\s\S]*?{% else %}/, '');
theme = theme.replace(/{% endif %}/, '');

// Simplfy Favicon
theme = theme.replace(/{% if settings.favicon != blank %}[\s\S]*?{% else %}/, '');
theme = theme.replace(/{% endif %}/, '');

// Clean other liquid tags
theme = theme.replace(/{{ content_for_header }}/g, '');
// UPDATE NAVIGATION LINKS FOR VERCEL
theme = theme.replace(/{{ routes.root_url }}/g, '/index.html');
theme = theme.replace(/{{ routes.all_products_collection_url }}/g, '/collection.html');
theme = theme.replace(/\/pages\/manifesto/g, '/manifesto.html');
theme = theme.replace(/{{ routes.account_url }}/g, '#');
theme = theme.replace(/{{ routes.account_login_url }}/g, '#');
theme = theme.replace(/{{ routes.cart_url }}/g, '#');
theme = theme.replace(/{{ routes.search_url }}/g, '#');

theme = theme.replace(/{{ cart.item_count }}/g, '0');
theme = theme.replace(/{{ shop.name \| escape }}/g, 'DailyScroll');
theme = theme.replace(/{{ shop.name \| upcase }}/g, 'DAILYSCROLL');
theme = theme.replace(/{{ 'now' \| date: '%Y' }}/g, '2026');

// Remove customer check
theme = theme.replace(/{% if customer %}/g, '');

// Remove collection loop in footer
theme = theme.replace(/{% for collection in collections limit:3 %}[\s\S]*?{% endfor %}/g, '');


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

let indexHtml = theme.replace('{{ content_for_layout }}', index);
indexHtml = indexHtml.replace(/{{[^}]+}}/g, '').replace(/{%[^}]+%}/g, '');
fs.writeFileSync('index.html', indexHtml);


// --- 3. Clean collection.liquid (Shop) ---
let collection = rawCollection;
collection = collection.replace(/{{ collection.title \| upcase }}/g, 'ALL OBJECTS');
collection = collection.replace(/{{ collection.title \| escape }}/g, 'ALL OBJECTS');
// Remove liquid if/else blocks and logic
collection = collection.replace(/{% if collection.description != blank %}[\s\S]*?{% endif %}/g, '');
collection = collection.replace(/{% for col in collections %}[\s\S]*?{% endfor %}/g, '');
collection = collection.replace(/{% if settings.show_ad_shop and settings.ad_image != blank %}[\s\S]*?{% endif %}/g, '');

let cStart = collection.indexOf("{% if collection.products.size > 0 %}");
let cElse = collection.indexOf("{% else %}", cStart);
if (cStart > -1 && cElse > -1) {
    collection = collection.substring(0, cStart) + collection.substring(cElse + 10);
}
collection = collection.replace(/{% endif %}/g, '');
collection = collection.replace(/{{\s*'([^']+)'\s*\|\s*asset_url\s*}}/g, './assets/$1');

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

console.log('Static site (index.html, collection.html, manifesto.html) generated perfectly for Vercel!');
