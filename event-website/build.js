const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const srcDir = path.join(__dirname, 'src');
const talksPath = path.join(__dirname, 'talks.json');

const htmlTemplate = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf-8');
const cssContent = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf-8');
const jsTemplate = fs.readFileSync(path.join(srcDir, 'script.js'), 'utf-8');
const talksContent = fs.readFileSync(talksPath, 'utf-8');

const jsContent = jsTemplate.replace(
  "fetch('talks.json')",
  `new Promise(resolve => resolve({ json: () => ${talksContent} }))`
);

const finalHtml = htmlTemplate
  .replace('<link rel="stylesheet" href="style.css">', `<style>${cssContent}</style>`)
  .replace('<script src="script.js"></script>', `<script>${jsContent}</script>`);

fs.writeFileSync(path.join(distDir, 'index.html'), finalHtml);

console.log('Build successful! The serverless website is in the dist directory.');
