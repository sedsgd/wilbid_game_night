import html, os
E = html.escape
OUT = "/tmp/mj/index.html"

KOLA = lambda fill, hole, size: f'<svg width="{size}" height="{size}" viewBox="0 0 48 48" aria-hidden="true"><g transform="rotate(45 24 24)" fill="{fill}"><circle cx="14" cy="14" r="9.2"/><circle cx="34" cy="14" r="9.2"/><circle cx="14" cy="34" r="9.2"/><circle cx="34" cy="34" r="9.2"/></g><path d="M24 19 29 24 24 29 19 24Z" fill="{hole}"/></svg>'

GAMES = [
 dict(n="1", slug="mokolo", title="Le Marché de Mokolo", kind="échange et négociation, brise-glace", dur="30 min", fmt="individuel", max="15",
  pitch="Comme au marché, tout se négocie. Chacun doit réunir une combinaison secrète de marchandises en troquant avec les autres.",
  rules=["Chaque joueur pioche 4 cartes marchandise (plantain, ndolé, safou, arachide, macabo, poisson braisé) et 1 carte objectif secrète, par exemple « 4 safous » ou « 4 produits différents ».",
         "Pendant 15 minutes, on échange librement : 1 carte contre 1 carte, avec un peu de Kola en plus si on veut convaincre.",
         "Chaque échange se fait avec une personne différente. Avant d'échanger, on se présente : prénom et ville ou région d'origine au Cameroun.",
         "On peut mentir sur son objectif. On ne peut pas refuser de dire son prénom.",
         "Dès qu'on a son objectif, on le montre au MJ, qui note l'ordre d'arrivée."],
  score=[("Objectif atteint", "8 PW"), ("1er, 2e, 3e à finir", "+3, +2, +1 PW"), ("Par partenaire d'échange différent (max 4)", "+1 PW")],
  mat="72 cartes marchandise (6 produits × 12) et 18 cartes objectif, imprimées et découpées.",
  mj="Vérifie avant la soirée que chaque objectif reste atteignable : pas plus de 3 objectifs « 4 identiques » sur le même produit. Annonce à voix haute quand il reste 5 minutes, puis 1 minute."),
 dict(n="2", slug="quiestqui", title="Qui est qui ?", kind="déduction sociale", dur="40 min", fmt="individuel", max="15",
  pitch="Retrouver à qui appartient chaque anecdote, en posant des questions malignes.",
  rules=["Une semaine avant, chaque inscrit remplit un formulaire anonyme (Google Forms) avec 3 anecdotes vraies sur lui. Le MJ en garde une par personne et les numérote.",
         "Le jour J, les anecdotes sont affichées au mur. Chaque joueur reçoit une grille vierge.",
         "Pendant 25 minutes, on circule et on pose des questions. Interdit de demander « c'est toi, l'anecdote 7 ? ». Interdit de mentir. On peut refuser de répondre 2 fois.",
         "Au bout du temps, chacun rend sa grille avec un nom pour chaque anecdote.",
         "Le MJ révèle les réponses une par une, et chaque propriétaire raconte son histoire en 30 secondes."],
  score=[("Par bonne réponse (max 12)", "1 PW"), ("Bonus mystère : moins d'un tiers a trouvé ton anecdote", "+3 PW")],
  mat="Grilles et anecdotes imprimées, stylos.",
  mj="Choisis des anecdotes ni trop évidentes ni gênantes, et écarte celles déjà racontées dans le groupe WhatsApp. Pendant la révélation, tiens les 30 secondes par personne, sinon le jeu déborde de 20 minutes."),
 dict(n="3", slug="njangi", title="Le Njangi", kind="enchères et psychologie", dur="30 min", fmt="individuel", max="15",
  pitch="Une tontine où seule la mise la plus haute et unique empoche la bouffe.",
  rules=["On joue 8 tours.",
         "À chaque tour, chacun cache entre 0 et 4 Kola dans son poing fermé.",
         "Au signal du MJ, tout le monde ouvre la main en même temps. Toutes les Kola misées vont dans la bouffe du tour.",
         "La mise la plus haute que personne d'autre n'a jouée gagne toute la bouffe. Exemple : trois joueurs misent 4, un seul mise 3, c'est lui qui gagne.",
         "Aucune mise unique ? La bouffe reste pour le tour suivant. Ce qui reste après le tour 8 est perdu."],
  score=[("Les Kola gagnées", "1 Kola = 1 PW à la fin"), ("Par tour gagné (max 15)", "+2 PW")],
  mat="Les jetons Kola de la soirée.",
  mj="Compte « 1, 2, 3, ouvrez » : personne ne change sa mise après le 3. Garde une feuille avec la bouffe reportée d'un tour à l'autre pour éviter les disputes."),
 dict(n="4", slug="duos", title="Le Carrefour des Duos", kind="énigmes à deux, rencontres", dur="45 min", fmt="duos tournants", max="12",
  pitch="Un tête-à-tête de 3 minutes avec presque tout le monde, autour d'une énigme à résoudre ensemble. C'est le moment où les célibataires se parlent sans en avoir l'air.",
  rules=["Deux cercles de 9 chaises, face à face. Si possible, filles d'un côté et garçons de l'autre.",
         "À chaque manche, le MJ donne la même énigme à tous les duos : logique, calcul, devinette ou proverbe camerounais à compléter.",
         "Le duo a 3 minutes pour écrire sa réponse sur un papier signé par les deux.",
         "Le cercle extérieur tourne d'une chaise. On joue 9 manches.",
         "À la fin, chacun écrit en secret le nom de son meilleur coéquipier de la soirée."],
  score=[("Par énigme résolue, pour chaque membre du duo (max 9)", "1 PW"), ("Choix réciproque du meilleur coéquipier", "+3 PW chacun")],
  mat="9 énigmes imprimées en 9 exemplaires, 1 minuteur, papiers.",
  mj="Prépare les 9 énigmes et leurs réponses avant la soirée. Si le nombre de joueurs est impair, un organisateur complète le cercle hors classement. Les choix réciproques ne s'annoncent qu'aux deux personnes concernées, en privé."),
 dict(n="5", slug="wouri", title="Le Pont du Wouri", kind="négociation, alliances et trahison", dur="45 min", fmt="6 équipes de 3", max="15",
  pitch="Toutes les équipes doivent construire ensemble un pont. Celui qui donne peu gagne plus, mais si tout le monde fait pareil, le pont s'effondre.",
  rules=["Chaque équipe reçoit 12 planches (bâtonnets en bois). On joue 6 tours.",
         "À chaque tour, chaque équipe glisse en secret 0 à 3 planches dans son enveloppe et la remet au MJ.",
         "Le MJ annonce seulement le total. À 10 planches ou plus, le pont tient et chaque équipe reçoit 4 planches de la mairie. Sinon, personne ne reçoit rien et les planches données sont perdues.",
         "Entre deux tours, 3 minutes de négociation : promesses, alliances, menaces. Rien n'oblige à tenir sa parole.",
         "Après le tour 3, une équipe peut payer 1 planche pour que le MJ lui montre en secret ce qu'une autre équipe a donné jusqu'ici."],
  score=[("Planches restantes ÷ 2, arrondi au supérieur", "PW pour chaque membre"), ("Plafond", "15 PW")],
  mat="100 bâtonnets en bois, 6 enveloppes opaques.",
  mj="Note dans un tableau secret ce que chaque équipe donne à chaque tour : tu en as besoin pour le contrôle de la mairie. N'annonce que le total, jamais le détail."),
 dict(n="6", slug="code", title="Le Code du Chef", kind="déduction, échange d'informations, bluff", dur="50 min", fmt="6 nouvelles équipes de 3", max="15",
  pitch="Le Chef a caché un code. Toutes les équipes cherchent le même code, et chacune peut vendre ses indices aux autres, vrais ou faux.",
  rules=["Le MJ choisit un code secret de 4 symboles différents parmi 6 : masque, tam-tam, éléphant, lion, case, cabosse de cacao.",
         "Une équipe propose une combinaison sur un papier. Le MJ répond en privé : combien de symboles sont bien placés, combien sont dans le code mais mal placés.",
         "Chaque essai coûte 1 Kola à l'équipe. Au plus 1 essai par minute et par équipe.",
         "Les équipes peuvent échanger ou vendre leurs résultats contre des Kola. On a le droit de mentir.",
         "3 manches de 12 minutes, avec un nouveau code à chaque manche."],
  score=[("1re équipe à trouver, par manche", "5 PW"), ("2e équipe", "3 PW"), ("3e équipe", "1 PW")],
  mat="6 jeux de cartes symboles et 6 mini-tableaux blancs avec feutres.",
  mj="Écris les 3 codes sur des papiers pliés avant le jeu. Si la file d'attente s'allonge, un organisateur t'aide à répondre avec une copie du code. Tiens une fiche d'essais par équipe."),
 dict(n="7", slug="feymen", title="Les Feymen", kind="rôles cachés, bluff, déduction", dur="50 min", fmt="individuel", max="15",
  pitch="3 feymen (2 si vous êtes 15) se cachent parmi les joueurs et arnaquent dans les affaires. Les honnêtes doivent les démasquer en recoupant qui a fait affaire avec qui.",
  rules=["Chacun reçoit en secret une carte rôle. Les feymen se reconnaissent pendant que les autres ont les yeux fermés.",
         "Chaque joueur reçoit 6 cartes. Un honnête a 6 « Honnête ». Un feyman a 4 « Honnête » et 2 « Arnaque ».",
         "3 tours. À chaque tour, 5 minutes pour conclure au plus 2 affaires, avec 2 personnes différentes.",
         "Une affaire : les deux écrivent leurs noms sur un contrat, mettent chacun une carte face cachée dans l'enveloppe et la remettent au MJ.",
         "Le MJ annonce les noms des victimes du tour, jamais celui de l'arnaqueur.",
         "Après chaque tour, 3 minutes de débat. À la fin, vote secret : chacun nomme 3 suspects."],
  score=[("Deux « Honnête »", "2 PW chacun"), ("Une « Arnaque »", "3 PW arnaqueur, 0 victime"), ("Deux « Arnaque »", "1 PW chacun, rien n'est annoncé"), ("Feyman bien nommé par un honnête", "+2 PW"), ("Feyman nommé par plus de la moitié", "perd ses PW du jeu"), ("Feyman non démasqué", "+5 PW")],
  mat="Cartes rôle, cartes Honnête et Arnaque, petites enveloppes.",
  mj="Tire les rôles avant le jeu. Ouvre les contrats à l'écart, avec un organisateur, et note chaque contrat et son résultat. Ne révèle les feymen qu'après le vote. Au-delà de 20 joueurs, ajoute 1 feyman par tranche de 6 joueurs."),
 dict(n="F", slug="trone", title="Le Trône de Kola", kind="la finale, bluff et enchères", dur="30 min", fmt="les 4 premiers", max="36",
  pitch="Un duel de cartes où il faut deviner ce que les autres vont jouer. Le public parie sur le vainqueur.",
  rules=["Chaque finaliste a 8 cartes numérotées de 1 à 8.",
         "Le MJ mélange 8 lots valant de 1 à 8 PW et en retourne un par tour.",
         "Les finalistes posent chacun une carte face cachée, puis on révèle en même temps.",
         "La plus haute carte unique gagne le lot. Si deux finalistes jouent la même carte la plus haute, ils s'annulent et la carte unique suivante gagne.",
         "Chaque carte jouée est défaussée. On joue les 8 tours."],
  score=[("Lots gagnés", "36 PW en jeu"), ("Pari du public juste", "+3 PW au classement")],
  mat="4 jeux de cartes 1 à 8 et 8 cartes lot.",
  mj="Ramasse les paris du public avant la première carte. Mets les finalistes au centre de la salle, debout, et révèle chaque carte en laissant un temps de suspense."),
]

SCHED = [("19h30","Accueil, badges, cotisation, 10 Kola par joueur",None,"30 min"),
 ("20h00","Le Marché de Mokolo","mokolo","30 min"),("20h40","Qui est qui ?","quiestqui","40 min"),
 ("21h25","Le Njangi","njangi","30 min"),("22h00","Le Carrefour des Duos","duos","45 min"),
 ("22h45","Repas et musique",None,"60 min"),("23h45","Le Pont du Wouri","wouri","45 min"),
 ("00h40","Le Code du Chef","code","50 min"),("01h30","Pause",None,"20 min"),
 ("01h50","Les Feymen","feymen","50 min"),("02h45","Conversion des Kola, classement, finalistes",None,"15 min"),
 ("03h00","Finale : Le Trône de Kola","trone","30 min"),("03h30","Remise des gains, photo de groupe",None,"15 min"),
 ("03h45","Ambiance libre jusqu'au matin",None,"")]

def foot(p, label="Dossier du maître du jeu"):
    return f'<footer class="foot"><span>{KOLA("#141E4A","#fff",14)} Wilbid Game Night, saison 1</span><span>{label}</span><span>p. {p}</span></footer>'

pages = []
# Cover
pages.append(f'''<section class="page cover">
<img class="cv-img" src="assets/hero.jpg" alt="">
<div class="cv-fade"></div>
<div class="cv-top"><div class="pill">{KOLA("#F2B705","#141E4A",22)}<b>wilbid</b></div><span class="pill red">Réservé au MJ</span></div>
<div class="cv-body">
<div class="acc">programme de la soirée</div>
<h1>Dossier du<br>maître du jeu</h1>
<p class="cv-lead">Tout ce qu'il faut pour animer la Wilbid Game Night : l'ordre de la nuit, les règles des 8 jeux, le barème et le rôle du MJ à chaque étape.</p>
<div class="stats"><div><b>19h30 à 4h</b>la nuit</div><div><b>7 + 1</b>jeux et finale</div><div><b>15 à 20</b>joueurs</div><div><b>8 €</b>cotisation</div></div>
</div></section>''')

# Overview + schedule
rows = "".join(
    f'<li class="{ "ev" if s else "brk"}"><span class="t">{t}</span>' +
    (f'<img src="assets/em-{s}.jpg" alt="">' if s else f'<i class="dot"></i>') +
    f'<span class="l">{E(l)}</span><span class="d">{d}</span></li>' for t,l,s,d in SCHED)
pages.append(f'''<section class="page">
<div class="kicker">01 · La nuit en un coup d'œil</div>
<h2>Une nuit qui monte en intensité</h2>
<p class="lead">On commence par des jeux qui font se rencontrer, on garde la stratégie lourde pour après le repas, et on finit par la finale à 4 joueurs.</p>
<div class="two">
<ol class="sched">{rows}</ol>
<div class="side">
<div class="card indigo"><h3>Les principes</h3>
<ul><li><b>Méninges d'abord</b> : déduction, négociation, alliances, enchères.</li>
<li><b>On se mélange</b> : équipes tirées au sort à chaque jeu, au moins une fille et un garçon par équipe.</li>
<li><b>Une monnaie qui circule</b> : 10 Kola par joueur à l'arrivée. On les mise, on les échange. À la fin, 1 Kola = 1 PW.</li>
<li><b>Peu de matériel</b> : jetons, enveloppes, cartes imprimées.</li></ul></div>
<div class="card"><h3>Si on prend du retard</h3><p>On retire le Njangi : c'est le jeu le plus court à sauter sans casser l'équilibre des points.</p></div>
<div class="card"><h3>Plus de 20 joueurs ?</h3><p>Équipes de 4 au lieu de 3, et 1 feyman par tranche de 6 joueurs. Avec 15 joueurs, 5 équipes de 3.</p></div>
</div></div>
{foot(2)}</section>''')

# Points + roles
pages.append(f'''<section class="page">
<div class="kicker">02 · Points, kola et cagnotte</div>
<h2>Chaque jeu vaut au plus 15 PW</h2>
<p class="lead">Aucun jeu ne décide seul du classement. Les Points Wilbid (PW) se cumulent toute la nuit, et la finale met 36 PW en jeu pour que les 4 finalistes gardent tous une chance.</p>
<div class="two eq">
<div>
<h3>Comment on compte</h3>
<ol class="num">
<li>Après chaque jeu, le comptable note les PW de chaque joueur sur le tableau des scores.</li>
<li>Dans les jeux d'équipe, chaque membre reçoit les PW de l'équipe.</li>
<li>Avant la finale, les Kola sont converties : 1 Kola = 1 PW.</li>
<li>Les 4 premiers jouent la finale. Égalité pour la 4e place : le plus de Kola passe.</li>
<li>Classement final = PW cumulés + PW de la finale.</li></ol>
</div>
<div>
<h3>Cotisation et cagnotte</h3>
<table class="tbl"><thead><tr><th>Poste</th><th>Par pers.</th><th>18 joueurs</th></tr></thead>
<tbody><tr><td>Cagnotte des gagnants</td><td>5 €</td><td>90 €</td></tr><tr><td>Matériel (1re édition)</td><td>3 €</td><td>54 €</td></tr><tr class="tot"><td>Total</td><td>8 €</td><td>144 €</td></tr></tbody></table>
<div class="podium"><div class="p2"><b>2e</b><span>30 %</span><i>27 €</i></div><div class="p1"><b>1er</b><span>50 %</span><i>45 €</i></div><div class="p3"><b>3e</b><span>20 %</span><i>18 €</i></div></div>
<p class="small">Dès la 2e édition, les 3 € de matériel peuvent aller à la cagnotte ou aux boissons. Pour le repas, chacun apporte un plat ou une boisson.</p>
</div></div>
<h3 class="mt">Qui fait quoi</h3>
<div class="roles">
<div class="role red">{KOLA("#fff","#E0452F",34)}<div><b>Maître du jeu</b><span>Badge rouge</span><p>Annonce les règles, tient le temps, tranche les litiges, ouvre les enveloppes. Hors classement.</p></div></div>
<div class="role yel">{KOLA("#141E4A","#F2B705",34)}<div><b>Organisateurs</b><span>Badge jaune</span><p>Le comptable tient le tableau des scores. Les autres distribuent le matériel et aident le MJ.</p></div></div>
<div class="role wht">{KOLA("#E0452F","#fff",34)}<div><b>Joueurs</b><span>Badge blanc</span><p>Prénom bien visible et ville d'origine, pour que tout le monde se parle.</p></div></div>
</div>
{foot(3)}</section>''')

# Game pages
for i, g in enumerate(GAMES):
    rules = "".join(f"<li>{E(r)}</li>" for r in g["rules"])
    score = "".join(f'<tr><td>{E(a)}</td><td>{E(b)}</td></tr>' for a,b in g["score"])
    label = "Finale" if g["n"]=="F" else f'Jeu {g["n"]}'
    fin = " finale" if g["n"]=="F" else ""
    pages.append(f'''<section class="page game{fin}">
<header class="gh">
<img class="em" src="assets/em-{g["slug"]}.jpg" alt="">
<div class="gt"><span class="badge">{label}</span><div class="acc">{E(g["kind"])}</div><h2>{E(g["title"])}</h2></div>
</header>
<div class="gstats"><div><b>{g["dur"]}</b>durée</div><div><b>{E(g["fmt"])}</b>format</div><div><b>{g["max"]} PW</b>au maximum</div></div>
<p class="lead">{E(g["pitch"])}</p>
<h3>Règles</h3>
<ol class="num">{rules}</ol>
<div class="two eq bottom">
<div class="card indigo score"><h3>Barème</h3><table>{score}</table></div>
<div class="stack">
<div class="card"><h3>Matériel</h3><p>{E(g["mat"])}</p></div>
<div class="card mjnote"><h3>Note pour le MJ</h3><p>{E(g["mj"])}</p></div>
</div></div>
{foot(4+i)}</section>''')

# Material + prep
mat = [("Jetons de poker (les Kola)","300","10 €"),("Impression des cartes, papier cartonné","~15 pages","12 €"),("Mini-tableaux blancs + feutres","6","12 €"),
 ("Porte-badges, cordon blanc (joueurs)","30","6 €"),("Porte-badges, cordon rouge et jaune (MJ, orga)","6","3 €"),("Petites enveloppes kraft","100","5 €"),
 ("Bâtonnets en bois","100","3 €"),("Stylos","20","3 €"),("Sablier ou minuteur","2","3 €")]
mrows = "".join(f"<tr><td>{E(a)}</td><td>{b}</td><td>{c}</td></tr>" for a,b,c in mat)
prep = [("J-21","Sondage WhatsApp : date et inscriptions, annonce de la cotisation"),("J-20","Commande Temu (livraison 1 à 2 semaines)"),
 ("J-10","Formulaire d'anecdotes pour Qui est qui ?"),("J-7","Choix du MJ et du comptable, rédaction des 9 énigmes"),
 ("J-5","Impression et découpe des cartes et badges"),("J-3","Répétition des Feymen et de la finale à 4 ou 5"),
 ("J-1","Enveloppes, feuille de scores, équipes tirées au sort")]
prows = "".join(f'<li><b>{a}</b><span>{E(b)}</span></li>' for a,b in prep)
night = ["Tableau des scores affiché et feutres","Les 3 codes du Code du Chef, pliés","Les rôles des Feymen tirés","Les 9 énigmes et leurs réponses","Les anecdotes numérotées, prêtes à afficher","Minuteur chargé"]
nrows = "".join(f"<li>{E(x)}</li>" for x in night)
pages.append(f'''<section class="page">
<div class="kicker">03 · Matériel et préparation</div>
<h2>57 € de matériel, réutilisé à chaque édition</h2>
<p class="lead">Prix estimés sur Temu, à vérifier au moment de commander. Pour économiser : imprimer à la fac, et remplacer les jetons par des capsules ou des haricots secs.</p>
<table class="tbl wide"><thead><tr><th>Article</th><th>Quantité</th><th>Coût estimé</th></tr></thead><tbody>{mrows}<tr class="tot"><td>Total</td><td></td><td>57 €</td></tr></tbody></table>
<div class="two eq mt">
<div><h3>Le compte à rebours</h3><ul class="prep">{prows}</ul></div>
<div class="card indigo"><h3>Dans le sac du MJ le soir même</h3><ul class="check">{nrows}</ul></div>
</div>
{foot(4+len(GAMES))}</section>''')

css = open("/tmp/mjbuild/style.css").read()
doc = f'''<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wilbid Game Night, dossier du maître du jeu</title>
<link rel="stylesheet" href="fonts/fonts.css">
<style>{css}</style></head><body>
{"".join(pages)}
</body></html>'''
doc=doc.replace('« ','«\u00a0').replace(' »','\u00a0»')
open(OUT,"w").write(doc)
print("pages", len(pages))
