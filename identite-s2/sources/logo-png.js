// Rend les SVG de identite-s2/logo/ en PNG transparents (pour PowerPoint, WhatsApp, impression).
// Usage : node identite-s2/sources/logo-png.js   (Playwright requis)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dossier = path.join(__dirname, '..', 'logo');
(async () => {
  const navigateur = await chromium.launch();
  const page = await navigateur.newPage();
  for (const nom of fs.readdirSync(dossier).filter(n => n.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(dossier, nom), 'utf8');
    const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const [w, h] = [parseFloat(vb[1]), parseFloat(vb[2])];
    // Symboles : 1024 px de côté. Logos : 480 px de haut.
    const hauteur = nom.startsWith('symbole') ? 1024 : 480;
    const largeur = Math.round(w * hauteur / h);
    await page.setViewportSize({ width: largeur, height: hauteur });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${largeur}px;height:${hauteur}px}</style>${svg}`);
    await page.screenshot({ path: path.join(dossier, nom.replace('.svg', '.png')), omitBackground: true });
  }
  await navigateur.close();
})();
