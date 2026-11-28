/* Présentation du jour J (PowerPoint 16:9), générée à partir de data.js.
   Usage : node documents/sources/presentation/build.js
   Dépendances : pptxgenjs, sharp, qrcode (npm). Sortie : documents/presentation-jour-j/
   Les règles et le programme viennent de data.js : corriger une règle là-bas, puis relancer ce script. */
const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm');
const pptxgen = require('pptxgenjs'), sharp = require('sharp'), QR = require('qrcode');

const ROOT = path.resolve(__dirname, '../../..');
const OUT_DIR = path.join(ROOT, 'documents/presentation-jour-j');
const OUT = path.join(OUT_DIR, 'Wilbid-presentation-jour-J.pptx');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'wb-deck-'));
const SITE = 'https://sedsgd.github.io/wilbid_game_night/';

/* data.js attend un navigateur : on lui donne un faux window */
const ctx = { window: {}, location: { protocol: 'file:', hostname: '' } };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'), ctx);
const GAMES = ctx.window.WB_GAMES, SCHED = ctx.window.WB_SCHEDULE;
const G = Object.fromEntries(GAMES.map(g => [g.id, g]));
const at = id => SCHED.find(s => s.id === id || s.img === id);
/* Le jeu fil rouge (Opération Kongossa) : window.WB_FIL dans data.js. Copie de secours du barème tant qu'il n'y est pas. */
const FIL = ctx.window.WB_FIL || { max: 15,
  score: { fr: [['Mission accomplie','4 PW'],['Les 3 missions accomplies','+3 PW'],['Chasseur démasqué (sa carte te revient)','+2 PW'],['Fausse accusation','1 Kola à l’accusé']] },
  tip: { fr: 'Le meilleur chasseur parle d’abord de tout autre chose. Et méfie-toi de qui te pose trop de questions.' } };
/* Libellés courts du programme pour les moments sans jeu (ceux de data.js sont trop longs pour la slide) */
const SHORT = { accueil: 'Accueil, badges, cotisation', repas: 'Repas et musique', pause: 'Pause', classement: 'Kongossa, Kola et finalistes',
  gains: 'Remise des gains, photo', ambiance: 'Ambiance libre jusqu’au matin' };

/* Ndop Nuit : nuit indigo, rouge kola, jaune palme, violet safou */
const S2 = { velours: '17110E', coton: 'F6EBD9', orange: 'F07A1A', or: 'F2B705' };   // identité saison 2 « Toghu »
const HEX = { deep: '0D1538', navy: '141E4A', card: '1C2860', line: '2B3770', ink: 'F4F3EF', mute: 'B9C0E6', kola: 'E0452F', palm: 'F2B705', safou: '7A4FA3' };
const THEME = {
  name: 'Wilbid Ndop Nuit', headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: { dk1: HEX.deep, lt1: HEX.ink, dk2: HEX.navy, lt2: HEX.mute, accent1: HEX.kola, accent2: HEX.palm, accent3: HEX.safou,
            accent4: HEX.card, accent5: HEX.line, accent6: 'DAD8CF', hlink: HEX.palm, folHlink: HEX.mute }
};
const SERIF = 'Cambria';   // rappel de l'Instrument Serif italique du site
const W = 13.333, H = 7.5, M = 0.6;

async function prepImages() {
  const A = n => path.join(ROOT, 'assets', n);
  const out = {};
  // emblèmes détourés en cercle, pour qu'ils se posent sur n'importe quel fond
  const ems = ['accueil','mokolo','quiestqui','njangi','duos','repas','wouri','code','pause','feymen','classement','trone','gains','ambiance','kola','kongossa'];   // em-kongossa.jpg : à défaut, l’emblème kola
  for (const e of ems) {
    const src = fs.existsSync(A(`em-${e}.jpg`)) ? A(`em-${e}.jpg`) : A('em-kola.jpg'); const meta = await sharp(src).metadata(); const s = Math.min(meta.width, meta.height);
    const r = s / 2 - 1;
    const mask = Buffer.from(`<svg width="${s}" height="${s}"><circle cx="${s/2}" cy="${s/2}" r="${r}" fill="#fff"/></svg>`);
    out[e] = path.join(TMP, `em-${e}.png`);
    await sharp(src).composite([{ input: await sharp(mask).png().toBuffer(), blend: 'dest-in' }]).png({ palette: true, quality: 90, effort: 10 }).toFile(out[e]);
  }
  // motif ndop assombri pour les fonds
  const tile = await sharp(A('pattern.jpg')).resize(560, 560).toBuffer();
  out.pattern = path.join(TMP, 'pattern-bg.jpg');
  await sharp({ create: { width: 1920, height: 1080, channels: 3, background: '#' + HEX.navy } })
    .composite([{ input: tile, tile: true, top: 0, left: 0 },
                { input: { create: { width: 1920, height: 1080, channels: 4, background: { r: 13, g: 21, b: 56, alpha: 0.86 } } } }])
    .jpeg({ quality: 86 }).toFile(out.pattern);
  out.hero = A('hero.jpg'); out.s2hero = path.join(__dirname, 'images/s2-hero.jpg'); out.s2logo = path.join(__dirname, 'images/s2-logo.png'); out.mokolo = A('mokolo.jpg');
  // QR codes
  const qr = async (url, name) => { const f = path.join(TMP, name); await QR.toFile(f, url, { width: 600, margin: 2, color: { dark: '#' + HEX.deep, light: '#' + HEX.ink } }); return f; };
  out.qrAvis = await qr(SITE + 'avis.html', 'qr-avis.png');
  out.qrSite = await qr(SITE, 'qr-site.png');
  out.qrInsc = await qr(SITE + 'inscription.html', 'qr-inscription.png');
  return out;
}

async function build() {
  const IMG = await prepImages();
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'Wilbid Game Night : présentation du jour J';
  pres.author = 'Wilbid Game Night'; pres.company = 'Wilbid Game Night';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const INK = C.background1, MUTE = C.background2, DEEP = C.text1, NAVY = C.text2;
  const KOLA = C.accent1, PALM = C.accent2, SAFOU = C.accent3, CARD = C.accent4, LINE = C.accent5;

  /* ---------- layouts ---------- */
  const footer = [
    { text: { text: 'WILBID GAME NIGHT · SAISON 1', options: { x: M, y: 6.95, w: 6, h: 0.3, fontSize: 10, color: MUTE, bold: true, charSpacing: 2, margin: 0 } } },
  ];
  pres.defineSlideMaster({ title: 'WB_CONTENU', background: { color: NAVY },
    objects: [...footer, { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.45, w: W - 2 * M, h: 0.9, fontSize: 36, bold: true, color: INK, valign: 'middle', align: 'left', margin: 0 }, text: '' } }],
    slideNumber: { x: W - M - 0.8, y: 6.95, w: 0.8, h: 0.3, fontSize: 10, color: MUTE, align: 'right' } });
  pres.defineSlideMaster({ title: 'WB_MOTIF', background: { path: IMG.pattern },
    objects: [{ placeholder: { options: { name: 'title', type: 'title', x: 6.3, y: 2.0, w: 6.4, h: 1.6, fontSize: 46, bold: true, color: INK, valign: 'top', align: 'left', margin: 0 }, text: '' } }] });
  pres.defineSlideMaster({ title: 'WB_IMAGE', background: { color: DEEP }, objects: [] });

  const NOTES = (s, t) => s.addNotes(t);
  // espaces insécables autour des guillemets et avant : ? ! (typographie française)
  const nb = t => t.replace(/« /g, '«\u00A0').replace(/ »/g, '\u00A0»').replace(/ ([:?!;])/g, '\u00A0$1');
  const tb = (s, text, o) => s.addText(typeof text === 'string' ? nb(text) : text.map(r => ({ ...r, text: nb(r.text) })), { isTextBox: true, margin: 0, color: INK, ...o });
  const shadow = () => ({ type: 'outer', color: '000000', opacity: 0.35, blur: 12, offset: 4, angle: 90 });
  const card = (s, x, y, w, h, fill, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.18, fill: { color: fill || CARD }, line: { color: fill || CARD, width: 0 }, shadow: shadow(), objectName: name || 'carte' });
  const emblem = (s, key, x, y, d, name) => s.addImage({ path: IMG[key], x, y, w: d, h: d, altText: 'Emblème ' + key, objectName: name || 'embleme-' + key });
  const chip = (s, text, x, y, fill, color, w) => {
    const ww = w || Math.max(1.2, 0.3 + text.length * 0.11);
    s.addText(text, { isTextBox: true, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.2, x, y, w: ww, h: 0.44, fill: { color: fill }, color, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'pastille' });
    return ww;
  };
  const kicker = (s, text, x, y, w, color) => tb(s, text.toUpperCase(), { x, y, w, h: 0.4, fontSize: 16, bold: true, charSpacing: 3, color: color || KOLA });

  /* largeur moyenne d'un caractère en Arial ≈ 0,5 em : estimation des lignes pour éviter les débordements */
  const lines = (txt, pt, w, f = 0.46) => Math.max(1, Math.ceil(txt.length * pt * f / 72 / (w - 0.1)));

  /* carte « Barème » + conseil, à droite d'une slide de règles */
  function scoreCard(s, S, max, tip, crowded) {
    const cx = crowded ? 7.1 : 8.45, cw = W - M - cx, cy = 1.55, ch = 5.2;
    card(s, cx, cy, cw, ch, null, 'bareme');
    tb(s, [{ text: 'Barème', options: { bold: true, color: PALM } }, { text: `   jusqu’à ${max} PW`, options: { color: MUTE, fontSize: 14 } }], { x: cx + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.5, fontSize: 22, valign: 'middle' });
    const vw = crowded ? 2.0 : 1.6, lw2 = cw - 0.6 - vw - 0.1;
    const tpt = 16, tipH = tip ? lines(tip, tpt, cw - 0.6, 0.5) * tpt * 1.2 / 72 + 0.3 : 0;
    let spt = 18, sh;
    for (; spt >= 14; spt--) {
      sh = S.map(([l, v]) => Math.max(lines(l, spt, lw2, 0.54), lines(v, spt, vw, 0.6)) * spt * 1.2 / 72 + 0.18);
      if (sh.reduce((a, b) => a + b, 0) <= ch - 1.0 - tipH - 0.2) break;
    }
    let sy = cy + 0.95;
    S.forEach(([l, v], i) => {
      if (i) s.addShape(pres.shapes.LINE, { x: cx + 0.3, y: sy - 0.07, w: cw - 0.6, h: 0, line: { color: LINE, width: 1 }, objectName: 'separateur' });
      tb(s, l, { x: cx + 0.3, y: sy, w: lw2, h: sh[i] - 0.14, fontSize: spt, valign: 'top' });
      tb(s, v, { x: cx + cw - 0.3 - vw, y: sy, w: vw, h: sh[i] - 0.14, fontSize: spt, bold: true, color: PALM, align: 'right', valign: 'top' });
      sy += sh[i];
    });
    if (tip) tb(s, [{ text: 'Le conseil  ', options: { bold: true, italic: false, fontFace: 'Arial', color: PALM } }, { text: tip }],
       { x: cx + 0.3, y: cy + ch - tipH - 0.2, w: cw - 0.6, h: tipH, fontSize: tpt, italic: true, fontFace: SERIF, color: MUTE, valign: 'bottom' });
  }

  /* « interlude » : emblème à gauche, texte à droite, sur le motif ndop */
  function interlude(sec, o) {
    const s = pres.addSlide({ masterName: 'WB_MOTIF', sectionTitle: sec });
    emblem(s, o.em, 0.85, 1.15, 5.2);
    // bloc de texte centré verticalement sur l'emblème
    const tH = (o.titleLines || lines(o.title, 46, 6.4, 0.55)) * 0.72, aH = o.accent ? 0.75 : 0, bH = o.body ? lines(o.body, 20, 6.2) * 0.36 + 0.1 : 0, nH = o.next ? 0.75 : 0;
    let y = 3.75 - (0.5 + tH + 0.15 + aH + bH + nH) / 2;
    kicker(s, o.kicker, 6.3, y, 6.4, o.kColor); y += 0.5;
    tb(s, o.title, { x: 6.3, y, w: 6.4, h: tH, fontSize: 46, bold: true, valign: 'top', objectName: 'titre' }); y += tH + 0.15;
    if (o.accent) { tb(s, o.accent, { x: 6.3, y, w: 6.4, h: 0.6, fontSize: 26, italic: true, fontFace: SERIF, color: PALM }); y += aH; }
    if (o.body) { tb(s, o.body, { x: 6.3, y, w: 6.2, h: bH, fontSize: 20, color: MUTE, valign: 'top' }); y += bH; }
    if (o.next) { y += 0.3; tb(s, 'ENSUITE', { x: 6.3, y, w: 1.4, h: 0.44, fontSize: 13, bold: true, charSpacing: 2, color: MUTE, valign: 'middle' });
                  chip(s, o.next, 7.7, y, CARD, INK); }
    if (o.notes) NOTES(s, o.notes);
    return s;
  }

  /* ========== 1. ACCUEIL ========== */
  let sec = 'Accueil';
  pres.addSection({ title: sec });

  // 1. écran d'attente
  {
    const s = pres.addSlide({ masterName: 'WB_IMAGE', sectionTitle: sec });
    s.addImage({ path: IMG.hero, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H }, altText: 'Mains qui jouent aux kola sur un tissu ndop', objectName: 'illustration' });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 7.4, h: H, fill: { color: DEEP, transparency: 12 }, line: { color: DEEP, width: 0 }, objectName: 'voile' });
    kicker(s, 'Saison 1 · Ndop Nuit', M + 0.1, 1.5, 6.4);
    tb(s, 'Wilbid\nGame Night', { x: M + 0.1, y: 2.0, w: 6.6, h: 2.3, fontSize: 66, bold: true, valign: 'top', lineSpacingMultiple: 0.9 });
    tb(s, 'Une nuit de stratégie, d’alliances et de bluff', { x: M + 0.1, y: 4.35, w: 6.4, h: 0.6, fontSize: 24, italic: true, fontFace: SERIF, color: PALM });
    tb(s, 'Installe-toi : badge, 10 Kola et enveloppe Kongossa.\nOn commence à 20h00.', { x: M + 0.1, y: 5.3, w: 6.4, h: 0.9, fontSize: 18, color: MUTE });
    NOTES(s, 'Écran d’attente, affiché pendant l’accueil (19h30 à 20h00). Musique douce. Les organisateurs distribuent badges et Kola, encaissent la cotisation.');
  }

  // 2. bienvenue
  {
    const s = pres.addSlide({ masterName: 'WB_IMAGE', sectionTitle: sec });
    s.background = { path: IMG.pattern };
    s.addImage({ path: IMG.mokolo, x: 8.6, y: 0, w: W - 8.6, h: H, sizing: { type: 'cover', w: W - 8.6, h: H }, altText: 'Scène de marché camerounais', objectName: 'illustration' });
    kicker(s, 'Bienvenue à toutes et à tous', M + 0.1, 1.3, 7.5);
    tb(s, 'Bienvenue !', { x: M + 0.1, y: 1.8, w: 7.6, h: 1.4, fontSize: 72, bold: true });
    tb(s, 'Welcome · Mbolo · On dit quoi ?', { x: M + 0.1, y: 3.25, w: 7.6, h: 0.6, fontSize: 28, italic: true, fontFace: SERIF, color: PALM });
    tb(s, [
      { text: 'Ce soir : 7 jeux, une finale, des missions secrètes toute la nuit et une cagnotte pour le podium.', options: { breakLine: true } },
      { text: 'Et surtout : de nouvelles têtes à rencontrer.' }
    ], { x: M + 0.1, y: 4.3, w: 7.4, h: 1.9, fontSize: 22, color: INK, paraSpaceAfter: 8, valign: 'top' });
    NOTES(s, 'Mot d’ouverture du maître du jeu (2 minutes). Saluer tout le monde, remercier d’être venus, présenter les organisateurs. Rappeler le but : jouer, rire, rencontrer de nouvelles personnes. Les règles de chaque jeu seront expliquées juste avant de jouer.');
  }

  // 3. avant le premier jeu
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('Avant le premier jeu', { placeholder: 'title' });
    const items = [
      ['accueil', 'Ton badge', 'Ton prénom et ta ville, en grand : c’est comme ça qu’on se présente ce soir.'],
      ['gains', '8 €', 'La cotisation. 5 € vont directement dans la cagnotte du podium.'],
      ['kola', '10 Kola', 'Ta monnaie de la soirée. 1 Kola = 1 PW avant la finale.'],
      ['kongossa', '3 missions', 'Ton enveloppe Kongossa. Garde-la secrète, on l’ouvre à 20h00.'],
    ];
    const cw = (W - 2 * M - 0.4) / 2, ch = (6.55 - 1.6 - 0.35) / 2;
    items.forEach(([em, big, txt], i) => {
      const x = M + (i % 2) * (cw + 0.4), y = 1.6 + Math.floor(i / 2) * (ch + 0.35);
      card(s, x, y, cw, ch);
      emblem(s, em, x + 0.35, y + (ch - 1.6) / 2, 1.6);
      tb(s, big, { x: x + 2.25, y: y + 0.3, w: cw - 2.55, h: 0.7, fontSize: 32, bold: true, color: PALM });
      tb(s, txt, { x: x + 2.25, y: y + 1.05, w: cw - 2.55, h: ch - 1.3, fontSize: 18, color: INK, valign: 'top' });
    });
    NOTES(s, 'Vérifier que chacun a son badge, a payé sa cotisation, a reçu ses 10 Kola et son enveloppe Opération Kongossa (à ne pas ouvrir avant 20h00). Pour le repas, chacun a apporté un plat ou une boisson : les remercier.');
  }

  // 4. qui fait quoi
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('Qui fait quoi', { placeholder: 'title' });
    const roles = [
      [KOLA, INK, 'Maître du jeu', 'Badge rouge', 'Annonce, explique et tranche. Sa décision est finale.'],
      [PALM, DEEP, 'Organisateurs', 'Badge jaune', 'Scores, matériel et minuteurs. Une question ? Demande-leur.'],
      [INK, DEEP, 'Joueurs', 'Badge blanc', 'Prénom et ville. Tu joues, tu négocies, tu bluffes.'],
    ];
    const bw = 3.2, gap = 0.75, x0 = (W - 3 * bw - 2 * gap) / 2;
    roles.forEach(([fill, col, name, badge, desc], i) => {
      const x = x0 + i * (bw + gap), y = 1.6, h = 5.0;
      card(s, x, y, bw, h, fill, 'badge-' + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + bw / 2 - 0.45, y: y + 0.3, w: 0.9, h: 0.2, rectRadius: 0.1, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, objectName: 'trou-badge' });
      tb(s, badge.toUpperCase(), { x: x + 0.3, y: y + 0.85, w: bw - 0.6, h: 0.4, fontSize: 14, bold: true, charSpacing: 2, color: col, align: 'center' });
      tb(s, name, { x: x + 0.3, y: y + 1.45, w: bw - 0.6, h: 0.9, fontSize: 25, bold: true, color: col, align: 'center', valign: 'middle' });
      tb(s, desc, { x: x + 0.35, y: y + 2.6, w: bw - 0.7, h: 2.0, fontSize: 18, color: col, align: 'center', valign: 'top' });
    });
    NOTES(s, 'Présenter le maître du jeu et les organisateurs. Les badges sont imprimés depuis l’appli de classement (bouton Badges).');
  }

  // 5. programme
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('La nuit, heure par heure', { placeholder: 'title' });
    const rows = SCHED.map(it => {
      const g = it.id && G[it.id];
      return { at: it.at, em: g ? g.id : it.img, name: g ? g.name.fr : (SHORT[it.img] || it.fr), d: it.d, final: g && g.num === 'F', num: g ? g.num : null };
    });
    const half = Math.ceil(rows.length / 2), colW = (W - 2 * M - 0.5) / 2, rh = 0.68;
    rows.forEach((r, i) => {
      const col = i < half ? 0 : 1, row = i < half ? i : i - half;
      const x = M + col * (colW + 0.5), y = 1.55 + row * rh;
      emblem(s, r.em, x, y + 0.04, 0.56);
      tb(s, r.at, { x: x + 0.75, y, w: 1.05, h: 0.64, fontSize: 18, bold: true, color: PALM, valign: 'middle' });
      const label = r.num ? (r.final ? 'Finale · ' : `Jeu ${r.num} · `) : '';
      tb(s, [{ text: label, options: { color: r.final ? PALM : KOLA, bold: true } }, { text: r.name }],
         { x: x + 1.85, y, w: colW - 2.9, h: 0.64, fontSize: 16, valign: 'middle' });
      tb(s, r.d, { x: x + colW - 1.0, y, w: 1.0, h: 0.64, fontSize: 14, color: MUTE, align: 'right', valign: 'middle' });
    });
    tb(s, '+ Opération Kongossa, le jeu fil rouge, de 20h00 à 02h40 en parallèle', { x: M, y: 6.35, w: 8, h: 0.4, fontSize: 16, italic: true, fontFace: SERIF, color: PALM });
    NOTES(s, 'Le programme complet. Horaires indicatifs : on peut glisser de quelques minutes, le MJ garde le rythme avec les minuteurs.');
  }

  // 6. points
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('Comment on compte : les Points Wilbid (PW)', { placeholder: 'title' });
    const stats = [['15 PW', 'au maximum par jeu : aucun jeu ne décide seul du classement'], ['1 Kola = 1 PW', 'les Kola sont converties juste avant la finale'], ['Top 4', 'les 4 premiers jouent la finale, le Trône de Kola']];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    stats.forEach(([big, txt], i) => {
      const x = M + i * (cw + 0.4);
      card(s, x, 1.6, cw, 2.55);
      tb(s, big, { x: x + 0.35, y: 1.85, w: cw - 0.7, h: 1.0, fontSize: 32, bold: true, color: PALM });
      tb(s, txt, { x: x + 0.35, y: 2.9, w: cw - 0.7, h: 1.1, fontSize: 17, color: INK, valign: 'top' });
    });
    emblem(s, 'classement', M, 4.6, 1.7);
    tb(s, [
      { text: 'Après chaque jeu, le comptable note les PW de chacun.', options: { bullet: true, breakLine: true } },
      { text: 'Dans les jeux d’équipe, chaque membre reçoit les PW de l’équipe.', options: { bullet: true, breakLine: true } },
      { text: 'Égalité pour la finale : celui qui a le plus de Kola passe.', options: { bullet: true, breakLine: true } },
      { text: 'Classement final = PW cumulés + PW de la finale.', options: { bullet: true, bold: true, color: PALM } },
    ], { x: M + 2.1, y: 4.5, w: W - 2 * M - 2.1, h: 2.1, fontSize: 18, paraSpaceAfter: 6, valign: 'middle' });
    NOTES(s, 'Expliquer les PW et les Kola. Le classement est visible en direct sur l’écran de l’appli et sur le site.');
  }

  // 7. jeu fil rouge : Opération Kongossa
  interlude(sec, { em: 'kongossa', kicker: 'Toute la nuit · 20h00 à 02h40', title: 'Opération Kongossa', titleLines: 1, accent: 'Le jeu fil rouge : missions secrètes',
    body: 'Dans ton enveloppe, 3 missions sur 3 autres joueurs. Pendant ce temps, 3 chasseurs te visent aussi.',
    notes: 'Opération Kongossa, le jeu de toute la nuit. Les enveloppes ont été distribuées à l’accueil (19h30). Les missions ouvrent maintenant (20h00) et se ferment à la fin des Feymen (02h40).' });
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText([{ text: 'Opération Kongossa' }, { text: '  ·  les règles', options: { color: MUTE, bold: false } }], { placeholder: 'title' });
    const mis = [['Mot', 'Lui faire dire un mot précis'], ['Action', 'Lui faire faire quelque chose'], ['Secret', 'Lui soutirer une information']];
    const mw = (7.35 - 2 * 0.3) / 3;
    mis.forEach(([t, d], i) => {
      const x = M + i * (mw + 0.3);
      card(s, x, 1.55, mw, 1.95, null, 'mission-' + t);
      tb(s, 'MISSION', { x: x + 0.3, y: 1.75, w: mw - 0.6, h: 0.35, fontSize: 13, bold: true, charSpacing: 2, color: KOLA });
      tb(s, t, { x: x + 0.3, y: 2.05, w: mw - 0.6, h: 0.55, fontSize: 26, bold: true });
      tb(s, d, { x: x + 0.3, y: 2.65, w: mw - 0.6, h: 0.75, fontSize: 15, color: MUTE, valign: 'top' });
    });
    const steps = [
      [KOLA, 'Mission réussie ?', 'Dis « Kongossa ! » et fais parapher ta carte par ta cible.'],
      [PALM, 'Tu te sens visé ?', '« Je te vois ! » + son prénom + le type de mission. Juste : il te donne sa carte, écris « grillée » dessus. Faux : tu lui donnes 1 Kola.'],
      [INK, 'Respect', 'Pas de contact au-delà d’un check, on ne touche pas aux téléphones, une cible peut toujours dire non.'],
      [SAFOU, 'Boîte Kongossa', 'Carte paraphée ou grillée : dans la boîte près du comptable, tout de suite. Fermeture à 02h40.'],
    ];
    let y = 3.8;
    const stH = steps.map(([, t, d]) => lines(t + '  ' + d, 15, 6.65, 0.5) * 15 * 1.2 / 72 + 0.05);
    const stGap = Math.min(0.3, (6.75 - y - stH.reduce((a, b) => a + b, 0)) / (steps.length - 1));
    steps.forEach(([c, t, d], i) => {
      s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.05, w: 0.46, h: 0.46, fill: { color: c }, line: { color: c, width: 0 }, objectName: 'puce' });
      tb(s, [{ text: t + '  ', options: { bold: true } }, { text: d, options: { color: MUTE } }], { x: M + 0.7, y, w: 6.65, h: stH[i], fontSize: 15, valign: 'top' });
      y += stH[i] + stGap;
    });
    scoreCard(s, FIL.score.fr, FIL.max, null, false);
    NOTES(s, 'Le conseil à donner : ' + FIL.tip.fr + '\nExpliquer Opération Kongossa. Une mission déjà accomplie ne peut plus être grillée. Pause pendant les explications du MJ. La boîte Kongossa ferme à 02h40 ; les PW Kongossa entrent au classement à 02h45, avant l’annonce des finalistes. Une fausse accusation coûte 1 Kola, donnée à la personne accusée.');
  }

  /* ========== 2. LES JEUX ========== */
  function game(g, secTitle) {
    const fin = g.num === 'F';
    // couverture
    {
      const it = at(g.id);
      interlude(secTitle, {
        em: g.id, kicker: (fin ? 'La finale' : 'Jeu ' + g.num) + ' · ' + g.dur + ' min', kColor: fin ? PALM : KOLA,
        title: g.name.fr, accent: g.kind.fr.charAt(0).toUpperCase() + g.kind.fr.slice(1), body: g.pitch.fr,
        notes: `${it ? it.at + ' · ' : ''}${g.name.fr} (${g.dur} min, ${g.fmt.fr}). Lire l’accroche à voix haute, puis passer aux règles. Préparer le minuteur : page Minuteurs, ${fin ? 'Finale' : 'jeu ' + g.num}.${g.id === 'feymen' ? ' Annoncer que les missions Kongossa se ferment à la fin de ce jeu : dernières cartes dans la boîte Kongossa avant 02h40.' : ''}`,
      });
    }
    // règles + barème
    {
      const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: secTitle });
      s.addText([{ text: g.name.fr }, { text: '  ·  les règles', options: { color: MUTE, bold: false } }], { placeholder: 'title' });
      const crowded = g.score.fr.length > 4;
      const lx = M, lw = crowded ? 6.0 : 7.35, top = 1.55, bottom = 6.75, numD = 0.46, tx = lx + numD + 0.25, tw = lw - numD - 0.25;
      const R = g.rules.fr;
      let pt = 18, gap, hs;
      for (; pt >= 14; pt--) {
        hs = R.map(r => lines(r, pt, tw) * pt * 1.18 / 72 + 0.04);
        gap = (bottom - top - hs.reduce((a, b) => a + b, 0)) / (R.length - 1);
        if (gap >= 0.16) break;
      }
      gap = Math.min(gap, 0.35);
      let y = top;
      R.forEach((r, i) => {
        s.addShape(pres.shapes.OVAL, { x: lx, y: y + 0.02, w: numD, h: numD, fill: { color: fin ? SAFOU : KOLA }, line: { color: fin ? SAFOU : KOLA, width: 0 }, objectName: 'numero-regle' });
        tb(s, String(i + 1), { x: lx, y: y + 0.02, w: numD, h: numD, fontSize: 16, bold: true, align: 'center', valign: 'middle' });
        tb(s, r, { x: tx, y, w: tw, h: hs[i], fontSize: pt, valign: 'top', lineSpacingMultiple: 1.0 });
        y += hs[i] + gap;
      });
      scoreCard(s, g.score.fr, g.max, crowded ? null : g.tip.fr, crowded);
      NOTES(s, `Expliquer les règles (5 minutes au plus), répondre aux questions, puis lancer le minuteur. Format : ${g.fmt.fr}.${fin ? '' : '\nRappel : les missions Kongossa sont en pause pendant l’explication des règles.'}\nRègles complètes en anglais sur le site (bouton EN) pour les joueurs anglophones.${crowded ? '\nLe conseil à donner : ' + g.tip.fr : ''}`);
    }
  }

  sec = 'Jeux 1 à 4'; pres.addSection({ title: sec });
  ['mokolo', 'quiestqui', 'njangi', 'duos'].forEach(id => game(G[id], sec));

  sec = 'Repas'; pres.addSection({ title: sec });
  interlude(sec, { em: 'classement', kicker: 'Mi-temps', title: 'Le classement provisoire', accent: 'Après 4 jeux, qui mène la danse ?',
    body: 'Le comptable affiche le classement en direct.', next: `${at('repas').at} · Repas et musique`,
    notes: 'Passer sur l’écran du classement de l’appli (bouton Écran), puis revenir à la présentation pour le repas.' });
  interlude(sec, { em: 'repas', kicker: at('repas').at + ' · ' + at('repas').d, kColor: PALM, title: 'Repas et musique', accent: 'Merci à toutes celles et ceux qui ont cuisiné',
    body: 'On mange, on danse, on refait ses alliances… et on avance ses missions Kongossa.', next: `${at('wouri').at} · ${G.wouri.name.fr}`,
    notes: 'Laisser cette slide pendant tout le repas. Prévenir 10 minutes avant la reprise.' });

  sec = 'Jeux 5 à 7'; pres.addSection({ title: sec });
  game(G.wouri, sec); game(G.code, sec);
  interlude(sec, { em: 'pause', kicker: at('pause').at + ' · ' + at('pause').d, kColor: PALM, title: 'Pause', accent: 'On souffle, on boit un coup',
    body: 'Dernière ligne droite pour vos missions Kongossa : la boîte ferme à 02h40, à la fin des Feymen.', next: `${at('feymen').at} · ${G.feymen.name.fr}`,
    notes: 'Pause de 20 minutes. Préparer les cartes rôle et les enveloppes des Feymen.' });
  game(G.feymen, sec);

  /* ========== 3. FINALE ========== */
  sec = 'Finale'; pres.addSection({ title: sec });
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('Opération Kongossa : les résultats', { placeholder: 'title' });
    emblem(s, 'kongossa', M, 1.7, 3.0);
    tb(s, 'Le meilleur kongosseur de la nuit est…', { x: M + 3.5, y: 2.0, w: 8.0, h: 0.7, fontSize: 28, italic: true, fontFace: SERIF, color: PALM });
    tb(s, 'Prénom', { x: M + 3.5, y: 2.8, w: 8.0, h: 1.2, fontSize: 60, bold: true, objectName: 'meilleur-kongosseur' });
    tb(s, '… missions accomplies · … PW', { x: M + 3.5, y: 4.1, w: 8.0, h: 0.6, fontSize: 22, color: MUTE, objectName: 'score-kongosseur' });
    tb(s, 'Les PW Kongossa sont ajoutés au classement : place aux finalistes.', { x: M + 3.5, y: 5.2, w: 8.0, h: 0.6, fontSize: 18, color: INK });
    NOTES(s, `${at('classement').at} · La boîte Kongossa a fermé à 02h40 et le comptable a compté les cartes. Taper le prénom et le score du meilleur kongosseur avant de projeter. Ses PW (et ceux de tous) entrent au classement avant l’annonce des finalistes.`);
  }
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('Les 4 finalistes', { placeholder: 'title' });
    tb(s, 'PW Kongossa ajoutés, Kola converties (1 Kola = 1 PW). Égalité : le plus de Kola passe.', { x: M, y: 1.35, w: W - 2 * M, h: 0.5, fontSize: 20, italic: true, fontFace: SERIF, color: PALM });
    const cw = (W - 2 * M - 3 * 0.35) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.35);
      card(s, x, 2.2, cw, 3.4);
      tb(s, String(i + 1), { x: x + 0.3, y: 2.4, w: cw - 0.6, h: 1.2, fontSize: 66, bold: true, color: PALM });
      tb(s, 'Prénom', { x: x + 0.3, y: 3.75, w: cw - 0.6, h: 0.6, fontSize: 26, bold: true, objectName: 'finaliste-' + (i + 1) });
      tb(s, '… PW', { x: x + 0.3, y: 4.45, w: cw - 0.6, h: 0.5, fontSize: 18, color: MUTE, objectName: 'points-' + (i + 1) });
    }
    emblem(s, 'kola', M, 5.85, 0.9);
    tb(s, [{ text: 'Le public parie ! ', options: { bold: true, color: PALM } }, { text: 'Écris le nom de ton favori : pari juste = +3 PW au classement.' }],
       { x: M + 1.1, y: 5.85, w: W - 2 * M - 1.1, h: 0.9, fontSize: 20, valign: 'middle' });
    NOTES(s, `${at('classement').at} · Conversion des Kola et annonce des finalistes. Avant de projeter, taper les 4 prénoms et leurs PW dans les cartes (ou afficher l’écran du classement de l’appli). Ramasser les paris du public.`);
  }
  game(G.trone, sec);
  /* ========== 4. CLÔTURE ========== */
  sec = 'Clôture'; pres.addSection({ title: sec });
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('Le podium', { placeholder: 'title' });
    const pw = 3.3, gap = 0.4, x0 = (W - 3 * pw - 2 * gap) / 2, base = 6.55;
    const pods = [[2, 2.3, INK, DEEP], [1, 3.2, PALM, DEEP], [3, 1.6, KOLA, INK]];
    pods.forEach(([rank, h, fill, col], i) => {
      const x = x0 + i * (pw + gap), y = base - h;
      tb(s, 'Prénom', { x, y: y - 1.25, w: pw, h: 0.6, fontSize: 28, bold: true, align: 'center', objectName: 'podium-nom-' + rank });
      tb(s, '… €', { x, y: y - 0.65, w: pw, h: 0.45, fontSize: 20, color: PALM, align: 'center', objectName: 'podium-gain-' + rank });
      card(s, x, y, pw, h, fill, 'podium-' + rank);
      tb(s, String(rank), { x, y: y + 0.1, w: pw, h: Math.min(h - 0.2, 1.5), fontSize: rank === 1 ? 80 : 64, bold: true, color: col, align: 'center', valign: 'middle' });
    });
    NOTES(s, `${at('gains').at} · Remise des gains. Taper les prénoms et les montants avant de projeter. Annoncer dans l’ordre : 3e, 2e, puis 1er. Applaudissements !`);
  }
  {
    const s = pres.addSlide({ masterName: 'WB_IMAGE', sectionTitle: sec });
    s.addImage({ path: IMG.hero, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H }, altText: 'Mains qui jouent aux kola sur un tissu ndop', objectName: 'illustration' });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.6, w: W, h: 2.9, fill: { color: DEEP, transparency: 10 }, line: { color: DEEP, width: 0 }, objectName: 'voile' });
    tb(s, 'Photo de groupe !', { x: M + 0.1, y: 4.9, w: 9, h: 1.2, fontSize: 60, bold: true });
    tb(s, 'Tout le monde devant l’écran, badges bien visibles', { x: M + 0.1, y: 6.1, w: 10, h: 0.6, fontSize: 24, italic: true, fontFace: SERIF, color: PALM });
    NOTES(s, 'Photo de groupe. Rappeler que ceux qui ne veulent pas être photographiés peuvent se mettre de côté (repère « pas de photo » sur le badge).');
  }
  {
    const s = pres.addSlide({ masterName: 'WB_CONTENU', sectionTitle: sec });
    s.addText('Merci !', { placeholder: 'title' });
    const th = [['Aux joueurs', 'pour les alliances, les bluffs et les fous rires'], ['À celles et ceux qui ont cuisiné', 'pour chaque plat et chaque boisson partagés'], ['Au MJ et aux organisateurs', 'pour la préparation et les scores'], ['À nos partenaires', 'pour leur soutien']];
    th.forEach(([t, d], i) => {
      const y = 1.6 + i * 1.2;
      s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.12, w: 0.6, h: 0.6, fill: { color: i % 2 ? PALM : KOLA }, line: { color: i % 2 ? PALM : KOLA, width: 0 }, objectName: 'puce' });
      tb(s, t, { x: M + 0.9, y, w: 7.2, h: 0.5, fontSize: 26, bold: true });
      tb(s, d, { x: M + 0.9, y: y + 0.5, w: 7.2, h: 0.45, fontSize: 18, color: MUTE });
    });
    card(s, 9.0, 1.6, W - M - 9.0, 5.0, null, 'carte-avis');
    tb(s, 'Ton avis en 2 minutes', { x: 9.3, y: 1.85, w: W - M - 9.6, h: 0.5, fontSize: 20, bold: true, color: PALM, align: 'center' });
    s.addImage({ path: IMG.qrAvis, x: 9.3 + (W - M - 9.6 - 2.9) / 2, y: 2.5, w: 2.9, h: 2.9, altText: 'QR code vers le formulaire d’avis', objectName: 'qr-avis' });
    tb(s, 'Scanne pour dire ce qu’on garde et ce qu’on change', { x: 9.3, y: 5.55, w: W - M - 9.6, h: 0.8, fontSize: 15, color: MUTE, align: 'center', valign: 'top' });
    NOTES(s, 'Remerciements. Citer les partenaires par leur nom s’il y en a (ajouter leurs logos sur cette slide). Inviter tout le monde à remplir le formulaire d’avis.');
  }
  // saison 2 : identité « Toghu » (velours, coton, orange toghu, fil d'or)
  {
    const s = pres.addSlide({ masterName: 'WB_IMAGE', sectionTitle: sec });
    s.background = { color: S2.velours };
    s.addImage({ path: IMG.s2hero, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H }, altText: 'Visuel de la saison 2 Toghu : mains qui jouent aux kola sur un tissu toghu brodé', objectName: 'visuel-saison-2' });
    s.addImage({ path: IMG.s2logo, x: M + 0.1, y: 0.6, w: 3.3, h: 3.3 * 480 / 1877, altText: 'Logo Wilbid Game Night saison 2', objectName: 'logo-saison-2' });
    tb(s, 'PROCHAINEMENT', { x: M + 0.1, y: 1.8, w: 5.5, h: 0.4, fontSize: 16, bold: true, charSpacing: 3, color: S2.orange });
    tb(s, 'La saison 2\narrive.', { x: M + 0.1, y: 2.25, w: 5.6, h: 2.0, fontSize: 56, bold: true, color: S2.coton, valign: 'top', lineSpacingMultiple: 0.9 });
    tb(s, 'Toghu', { x: M + 0.1, y: 4.1, w: 5.5, h: 1.0, fontSize: 54, fontFace: SERIF, color: S2.or });
    s.addText('Date à annoncer', { isTextBox: true, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.25, x: M + 0.1, y: 5.15, w: 2.7, h: 0.55, fill: { color: S2.orange }, color: S2.velours, fontSize: 17, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: 'date-saison-2' });
    s.addImage({ path: IMG.qrInsc, x: M + 0.1, y: 5.9, w: 1.1, h: 1.1, altText: 'QR code vers la page d’inscription', objectName: 'qr-inscription' });
    tb(s, 'Inscriptions\nsur le site', { x: M + 1.4, y: 5.9, w: 2.2, h: 1.1, fontSize: 15, color: S2.coton, valign: 'middle' });
    NOTES(s, 'Annonce de la saison 2, « Toghu ». Remplacer « Date à annoncer » par la date dès qu’elle est fixée. Le QR code mène à la page d’inscription du site.');
  }
  interlude(sec, { em: 'ambiance', kicker: at('ambiance').at + ' · jusqu’au matin', kColor: PALM, title: 'À très vite !', accent: 'La fête continue, rentrez bien',
    body: 'Merci d’avoir fait de cette nuit la vôtre. On se retrouve à la saison 2.',
    notes: 'Au revoir. Laisser cette slide pendant l’ambiance libre.' });

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('Écrit :', OUT);
}

/* pptxgenjs écrit la palette Office par défaut : on y met les couleurs Ndop Nuit */
async function applyTheme(file, theme) {
  const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const f = 'ppt/theme/theme1.xml';
  let xml = await zip.file(f).async('string');
  xml = xml.replace(/<a:clrScheme name="[^"]*">([\s\S]*?)<\/a:clrScheme>/, (m, body) => {
    for (const [k, v] of Object.entries(theme.colors))
      body = body.replace(new RegExp(`<a:${k}>[\\s\\S]*?<\\/a:${k}>`), `<a:${k}><a:srgbClr val="${v}"/></a:${k}>`);
    return `<a:clrScheme name="${theme.name}">${body}</a:clrScheme>`;
  });
  zip.file(f, xml);
  for (const k of Object.keys(zip.files)) if (zip.files[k].dir) delete zip.files[k];  // pas d'entrées de dossier
  fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

fs.mkdirSync(OUT_DIR, { recursive: true });
build().catch(e => { console.error(e); process.exit(1); });
