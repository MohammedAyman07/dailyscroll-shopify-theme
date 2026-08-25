const fs = require('fs');

let theme = fs.readFileSync('layout/theme.liquid', 'utf8');
let index = fs.readFileSync('templates/index.liquid', 'utf8');

// 1. Clean theme.liquid
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
theme = theme.replace(/{{ routes.root_url }}/g, '/');
theme = theme.replace(/{{ routes.all_products_collection_url }}/g, '#shop');
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


// 2. Clean index.liquid
index = index.replace(/{{ 'now' \| date: '%Y' }}/g, '2026');

// Remove Ad carousel section entirely (relies heavily on settings variables)
index = index.replace(/<!-- AD CAROUSEL SECTION -->[\s\S]*?<!-- NEW DROP SECTION -->/g, '<!-- NEW DROP SECTION -->');

// Clean Products Grid
let productsStart = index.indexOf("{% assign featured_collection = collections['frontpage'] %}");
let productsElse = index.indexOf("{% else %}", productsStart);
if (productsStart > -1 && productsElse > -1) {
    // Remove the shopify loop, keep only the dummy products
    index = index.substring(0, productsStart) + index.substring(productsElse + 10);
}
index = index.replace(/{% endif %}/g, '');

// Fix asset_urls in dummy products
index = index.replace(/{{\s*'([^']+)'\s*\|\s*asset_url\s*}}/g, './assets/$1');
index = index.replace(/{{ routes.all_products_collection_url }}/g, '#shop');

// Fix Newsletter form
index = index.replace(/{% form 'customer', class: 'newsletter-form' %}/g, '<form class="newsletter-form" onsubmit="handleNewsletter(event)">');
index = index.replace(/{% endform %}/g, '</form>');

// 3. Merge
let finalHtml = theme.replace('{{ content_for_layout }}', index);

// Final cleanup: remove any lingering {{ }} or {% %} tags
finalHtml = finalHtml.replace(/{{[^}]+}}/g, '');
finalHtml = finalHtml.replace(/{%[^}]+%}/g, '');

fs.writeFileSync('index.html', finalHtml);
console.log('index.html successfully created!');
