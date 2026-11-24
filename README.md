# Wilbid Game Night

Le site, les outils et les documents de la Wilbid Game Night, une soirée de jeux de stratégie entre Camerounais de Bamberg, Erlangen et Nürnberg.

Tout est en HTML, CSS et JavaScript, sans dépendance à installer. Le dépôt peut être publié tel quel avec GitHub Pages.

## Contenu

| Dossier ou fichier | Ce que c'est |
| --- | --- |
| `index.html` | Le site : accueil, programme, livret de règles des 8 jeux en français et en anglais, système de points |
| `data.js` | Tous les textes du site et des règles, en `fr` et `en`. On corrige une règle ici, sans toucher au reste |
| `classement.html` | L'appli du comptable : joueurs, tirage des équipes, saisie des PW, Kola, classement, écran projecteur, badges à imprimer |
| `minuteurs/` | Un minuteur par jeu pour le projecteur, avec les phases enchaînées et les alertes sonores |
| `documents/dossier-mj/` | Le dossier du maître du jeu, en page web et en PDF A4 |
| `documents/proposition/` | Le dossier de partenariat, en page web et en PDF 16:9 |
| `documents/sources/` | Les scripts qui génèrent ces deux documents |
| `identite/` | L'identité visuelle Ndop Nuit : planches de tendance et maquettes |
| `assets/` | Illustrations, emblèmes des jeux et motif ndop |

## Publier avec GitHub Pages

1. Dans le dépôt, ouvrir **Settings**, puis **Pages**.
2. Dans **Build and deployment**, choisir **Deploy from a branch**, la branche `main` et le dossier `/ (root)`.
3. Après une minute, le site est en ligne à l'adresse `https://<compte>.github.io/<dépôt>/`.

## L'appli de classement

- Les données restent dans le navigateur de l'appareil du comptable (localStorage). Rien n'est envoyé sur internet.
- **Écran** ouvre le classement en grand pour le vidéoprojecteur. Ouvert dans un deuxième onglet ou une deuxième fenêtre du même navigateur, il se met à jour tout seul à chaque saisie.
- **Exporter** télécharge la soirée en JSON, pour la sauvegarder ou la reprendre sur un autre appareil avec **Importer**.
- **Badges** imprime les badges 54 × 86 mm : blanc pour les joueurs, rouge pour le MJ, jaune pour l'organisation.

## Identité visuelle

Palette : indigo nuit `#141E4A`, indigo ndop `#2B3F9E`, craie `#F4F3EF`, rouge kola `#E0452F`, jaune palmiste `#F2B705`, safou `#7A4FA3` (finale uniquement).
Polices Google Fonts : Syne (titres et scores), Manrope (texte), Instrument Serif italique (accents).

Les planches de `identite/canvas/` viennent de Claude Design et chargent leurs images depuis cet outil : elles servent de référence et ne s'affichent pas entièrement hors de Claude. Les illustrations sources sont dans le fichier Figma de la saison.
