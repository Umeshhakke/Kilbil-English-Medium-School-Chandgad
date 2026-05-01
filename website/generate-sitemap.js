require('@babel/register')({
  extensions: ['.js', '.jsx'],
  presets: ['@babel/preset-env', '@babel/preset-react']
});

const Sitemap = require('react-router-sitemap').default;

// Define your routes (adjust to match your actual routes)
const routes = [
  '/',
  '/about',
  '/admissions',
  '/contact',
  '/academics',
  '/gallery'
];

function generateSitemap() {
  return new Sitemap(JSON.stringify({ routes }))
    .build('https://kilbil-english-medium-school.netlify.app')
    .save('./public/sitemap.xml');
}

generateSitemap();