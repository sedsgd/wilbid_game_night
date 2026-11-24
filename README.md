# Wilbid Game Night

Le site, les outils et les documents de la Wilbid Game Night, une soirée de jeux de stratégie entre Camerounais de Bamberg, Erlangen et Nürnberg.

Tout est en HTML, CSS et JavaScript, sans dépendance à installer. Le dépôt peut être publié tel quel avec GitHub Pages.

## Contenu

| Dossier ou fichier | Ce que c'est |
| --- | --- |
| `index.html` | Le site : accueil, programme, livret de règles des 8 jeux en français et en anglais, système de points |
| `data.js` | Tous les textes du site et des règles, en `fr` et `en`. On corrige une règle ici, sans toucher au reste |
| `classement.html` | L'appli du comptable : joueurs, tirage des équipes, saisie des PW, Kola, classement, écran projecteur, badges à imprimer |
| `minuteurs/` | Un minuteur par jeu pour le projecteur, avec les phases enchaînées et les alertes sonores (outil de l'espace organisation) |
| `inscription.html` | Le formulaire d'inscription des joueurs : prénom, affichage public, anecdotes pour « Qui est qui ? », plat, photos (FR/EN) |
| `avis.html` | Le formulaire d'avis après la soirée (FR/EN) |
| `joueurs.css` | Le style commun de ces deux pages |
| `partenaires.html` | La page « Devenir partenaire » : formules, contreparties et formulaire de contact (FR/EN) |
| `legal.html` | Mentions légales (Impressum), confidentialité (RGPD) et droits d'auteur, en français et en anglais |
| `fonts/` | Les polices hébergées sur le site, sans appel à Google (RGPD) |
| `vendor/` | La bibliothèque supabase-js 2.45.4 (licence MIT) |
| `supabase/` | Le schéma de la base en ligne |
| `documents/dossier-mj/` | Le dossier du maître du jeu, en page web et en PDF A4 |
| `documents/proposition/` | Le dossier de partenariat, en page web et en PDF 16:9 |
| `documents/lettre-sponsoring/` | La lettre officielle de demande de sponsoring, en français et en allemand : page modifiable (adresse, signature) et PDF prêts à joindre |
| `documents/sources/` | Les scripts qui génèrent ces deux documents |
| `identite/` | L'identité visuelle Ndop Nuit : planches de tendance et maquettes |
| `assets/` | Illustrations, emblèmes des jeux et motif ndop |

## Publier avec GitHub Pages

1. Dans le dépôt, ouvrir **Settings**, puis **Pages**.
2. Dans **Build and deployment**, choisir **Deploy from a branch**, la branche `main` et le dossier `/ (root)`.
3. Après une minute, le site est en ligne à l'adresse `https://<compte>.github.io/<dépôt>/`.

## L'appli de classement

### En ligne (GitHub Pages)

- Sur `sedsgd.github.io`, l'espace organisation passe par la base **Supabase** du projet (serveurs à Francfort, UE). Chaque organisateur se connecte avec son e-mail et son mot de passe ; seuls les e-mails de la table `organisers` ont accès à la soirée.
- Ajouter un organisateur : dans Supabase, **Table Editor** > `organisers` > ajouter l'e-mail en minuscules. La personne crée ensuite son compte depuis l'écran de connexion.
- La soirée est partagée entre les appareils des organisateurs et sauvegardée à chaque saisie. Le **classement public** (prénom, ville, total) s'affiche en direct sur la page d'accueil du site.
- **Nouvelle soirée** archive la soirée en cours et en ouvre une nouvelle.
- L'onglet **Inscrits** liste les inscriptions de la soirée en cours, les ajoute aux joueurs en un clic (avec le pseudo ou l'anonymat choisi pour le classement public, et un repère « pas de photo » sur le badge), imprime les anecdotes de « Qui est qui ? » mélangées avec une page de réponses, et résume les avis.
- L'onglet **Partenaires** liste les demandes envoyées depuis `partenaires.html`.
- Réglage à faire une fois dans Supabase : **Authentication** > **URL Configuration** > *Site URL* = `https://sedsgd.github.io/wilbid_game_night/classement.html`, pour que les liens de confirmation et de mot de passe oublié reviennent sur l'appli.

### Hors ligne (artefact Claude ou fichier local sans base)

- L'espace organisation est protégé par un code propre à chaque appareil. À la première ouverture, on choisit le code ; ensuite il est demandé à chaque nouvelle session du navigateur. Le bouton **Verrouiller** referme l'accès. Seule une empreinte SHA-256 du code est enregistrée.
- Les données restent dans le navigateur de l'appareil du comptable (localStorage).
- Code oublié : **Effacer cet appareil** supprime le code et les données de la soirée sur cet appareil.

### Dans les deux cas

- **Minuteurs** ouvre les minuteurs des jeux, depuis la barre de l'espace organisation.
- **Écran** ouvre le classement en grand pour le vidéoprojecteur. Ouvert dans un deuxième onglet ou une deuxième fenêtre du même navigateur, il se met à jour tout seul à chaque saisie.
- **Exporter** télécharge la soirée en JSON, pour la sauvegarder ou la reprendre sur un autre appareil avec **Importer**.
- **Badges** imprime les badges 54 × 86 mm : blanc pour les joueurs, rouge pour le MJ, jaune pour l'organisation.

## Mentions légales

Remplir `WB_LEGAL` dans `data.js` (nom, adresse, e-mail de la personne responsable). Tant qu'un champ est vide, `legal.html` affiche « à compléter ».

## Identité visuelle

Palette : indigo nuit `#141E4A`, indigo ndop `#2B3F9E`, craie `#F4F3EF`, rouge kola `#E0452F`, jaune palmiste `#F2B705`, safou `#7A4FA3` (finale uniquement).
Polices Google Fonts : Syne (titres et scores), Manrope (texte), Instrument Serif italique (accents).

Les planches de `identite/canvas/` viennent de Claude Design et chargent leurs images depuis cet outil : elles servent de référence et ne s'affichent pas entièrement hors de Claude. Les illustrations sources sont dans le fichier Figma de la saison.
