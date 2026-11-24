import html
E = html.escape
OUT = "/tmp/pitch/index.html"
KOLA = lambda fill, hole, size: f'<svg width="{size}" height="{size}" viewBox="0 0 48 48" aria-hidden="true"><g transform="rotate(45 24 24)" fill="{fill}"><circle cx="14" cy="14" r="9.2"/><circle cx="34" cy="14" r="9.2"/><circle cx="14" cy="34" r="9.2"/><circle cx="34" cy="34" r="9.2"/></g><path d="M24 19 29 24 24 29 19 24Z" fill="{hole}"/></svg>'

GAMES = [("mokolo","Le Marché de Mokolo","On troque pour réunir sa combinaison secrète. Le brise-glace."),
 ("quiestqui","Qui est qui ?","Retrouver à qui appartient chaque anecdote, sans poser la question directe."),
 ("njangi","Le Njangi","Une tontine où seule la mise la plus haute et unique gagne."),
 ("duos","Le Carrefour des Duos","9 tête-à-tête de 3 minutes autour d'une énigme."),
 ("wouri","Le Pont du Wouri","Construire un pont ensemble, ou laisser les autres payer."),
 ("code","Le Code du Chef","Casser un code secret, et vendre ses indices, vrais ou faux."),
 ("feymen","Les Feymen","Des arnaqueurs cachés parmi nous. À démasquer."),
 ("trone","Le Trône de Kola","La finale à 4, devant tout le monde.")]

NIGHT = [("19h30","Accueil",""),("20h00","Mokolo, Qui est qui, Njangi, Duos","se rencontrer"),("22h45","Repas","chacun apporte un plat"),
 ("23h45","Wouri, Code du Chef, Feymen","la stratégie"),("02h45","Classement",""),("03h00","Finale","4 joueurs"),("03h30","Gains, photo, ambiance","")]

def foot(n): return f'<div class="sfoot"><span>{KOLA("#F2B705","#141E4A",13)} wilbid Game Night</span><span>{n} / 8</span></div>'

S = []
S.append(f'''<section class="slide cover">
<img class="cv" src="assets/hero.jpg" alt="">
<div class="cvl">
<div class="pill">{KOLA("#F2B705","#141E4A",20)}<b>wilbid</b></div>
<div class="acc y">dossier de partenariat, saison 1</div>
<h1>Une nuit,<br>8 jeux,<br>une cagnotte.</h1>
<p>Une soirée de jeux de stratégie qui réunit la communauté étudiante camerounaise de Bamberg, Erlangen et Nürnberg. Nous cherchons des partenaires pour la saison 1.</p>
</div></section>''')

S.append(f'''<section class="slide light split">
<div class="txt">
<div class="acc">le projet</div>
<h2>Une communauté qui se retrouve autour du jeu</h2>
<p class="lead">Wilbid Game Night réunit des étudiants camerounais de Franconie pour une nuit entière de jeux qui font réfléchir, deux fois par semestre. Les points se cumulent toute la nuit jusqu'à une finale devant tout le monde.</p>
<div class="pillars">
<div><b>Réunir</b><span>Un rendez-vous régulier pour une communauté loin de chez elle.</span></div>
<div><b>Faire se rencontrer</b><span>Équipes tirées au sort à chaque jeu : chacun parle à presque tout le monde.</span></div>
<div><b>Faire réfléchir</b><span>Déduction, négociation, enchères. Pas de jeux de hasard.</span></div>
</div></div>
<img class="side" src="assets/mokolo.jpg" alt="">
{foot(2)}</section>''')

S.append(f'''<section class="slide dark split">
<div class="txt">
<div class="acc y">l'inspiration</div>
<h2>L'esprit de The Devil's Plan, avec nos codes à nous</h2>
<p class="lead">On reprend ce qui rend la série prenante : des jeux où il faut réfléchir, bluffer et choisir ses alliés. Les règles sont originales, et chaque jeu parle du pays.</p>
<div class="tags"><span>Déduction</span><span>Négociation</span><span>Alliances et trahisons</span><span>Enchères</span><span>Rôles cachés</span></div>
<div class="words"><div><b>le njangi</b>la tontine devient un jeu d'enchères</div><div><b>les feymen</b>les arnaqueurs deviennent des rôles cachés</div><div><b>la kola</b>devient la monnaie de la nuit</div></div>
</div>
<img class="side" src="assets/feymen.jpg" alt="">
{foot(3)}</section>''')

S.append(f'''<section class="slide light">
<div class="acc">notre public</div>
<h2>Un public jeune, fidèle et très connecté</h2>
<div class="big pub"><div><b>35</b><span>membres dans la communauté WhatsApp</span></div><div><b>15 à 20+</b><span>participants à chaque soirée</span></div><div><b>4</b><span>soirées par an, deux par semestre</span></div><div><b>8 h</b><span>de présence, de 19h30 à 4h</span></div></div>
<p class="lead w">Des étudiants camerounais, francophones et anglophones, installés à Bamberg, Erlangen et Nürnberg. Ils s'organisent et partagent tout sur WhatsApp et Instagram, et ils recommandent ce qu'ils aiment.</p>
<div class="kolarow">{KOLA("#E0452F","#fff",40)}<p>Une soirée longue et rythmée : votre nom n'est pas vu une fois en passant, mais toute la nuit, sur les badges, les cartes et au moment de la finale.</p></div>
{foot(4)}</section>''')

cards = "".join(f'<div class="g"><img src="assets/em-{s}.jpg" alt=""><b>{E(t)}</b><span>{E(d)}</span></div>' for s,t,d in GAMES)
S.append(f'''<section class="slide dark">
<div class="acc y">le programme</div>
<h2>8 jeux, du brise-glace à la finale</h2>
<div class="grid">{cards}</div>
{foot(5)}</section>''')

tl = "".join(f'<div class="n"><b>{t}</b><span class="nl">{E(l)}</span><span class="ns">{E(s)}</span></div>' for t,l,s in NIGHT)
S.append(f'''<section class="slide light over">
<div class="acc">une nuit type</div>
<h2>On se rencontre d'abord, on se trahit après le repas</h2>
<div class="tl"><div class="bar"><i style="flex:3.25" class="c1"></i><i style="flex:1" class="c2"></i><i style="flex:3" class="c3"></i><i style="flex:1.25" class="c4"></i><i style="flex:.75" class="c5"></i></div>{tl}</div>
<p class="lead w mt">De 19h30 à 4h environ, puis ambiance libre jusqu'au matin. Si la soirée prend du retard, on saute le Njangi sans casser le classement.</p>
<img class="band" src="assets/flatlay.jpg" alt=""><div class="band-fade"></div>
{foot(6)}</section>''')

S.append(f'''<section class="slide dark split">
<div class="txt">
<div class="acc y">le partenariat</div>
<h2>Ce que vous apportez, ce que vous y gagnez</h2>
<div class="give"><div><h3>Vous pouvez apporter</h3><ul><li>Un lieu pour une nuit</li><li>Des lots ou une contribution à la cagnotte</li><li>Des boissons ou de la nourriture</li><li>L'impression des livrets, cartes et badges</li></ul></div>
<div><h3>Vous y gagnez</h3><ul><li>Votre logo sur les badges, livrets et cartes</li><li>Une mention dans les annonces WhatsApp et Instagram</li><li>Un jeu ou la finale « présenté par » vous</li><li>Un lot remis en votre nom, et les photos de la soirée</li></ul></div></div>
<p class="note">Aujourd'hui, la soirée tient sur 8 € de cotisation par joueur et 57 € de matériel. Chaque apport va directement à l'expérience des participants.</p>
</div>
<img class="side" src="assets/trone.jpg" alt="">
{foot(7)}</section>''')

S.append(f'''<section class="slide light over">
<div class="acc">les formules</div>
<h2>Trois façons de nous accompagner</h2>
<div class="tiers">
<div><i>Ami de la soirée</i><b>Un lot, des boissons ou de la nourriture</b><span>Votre nom cité à l'annonce et pendant la soirée.</span></div>
<div class="hl"><i>Partenaire de soirée</i><b>Le lieu, ou une contribution à la cagnotte</b><span>Votre logo sur les badges, le livret et le post Instagram, et un jeu présenté par vous.</span></div>
<div><i>Partenaire de saison</i><b>Un soutien sur les 4 soirées de l'année</b><span>Tout ce qui précède, une page sur notre site, et la finale « Le Trône de Kola » à votre nom.</span></div>
</div>
<div class="ready"><b>Parlons-en</b><span>Nous adaptons chaque formule à ce que vous pouvez offrir. Écrivez-nous : delta98@yahoo.com, ou via sedsgd.github.io/wilbid_game_night/partenaires.html</span></div>
<div class="pat"></div>
{foot(8)}</section>''')

css = open("/tmp/mjbuild/pitch.css").read()
doc = f'''<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wilbid Game Night, la proposition</title>
FONTLINK
<style>{css}</style></head><body>{"".join(S)}</body></html>'''
doc = doc.replace('« ','« ').replace(' »',' »').replace(' ?',' ?').replace(' :',' :')
import sys
mode = sys.argv[1] if len(sys.argv)>1 else "local"
link = '<link rel="stylesheet" href="fonts/fonts.css">' if mode=="local" else '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">'
open(OUT if mode=="local" else "/home/user/pitchweb/index.html","w").write(doc.replace("FONTLINK",link))
