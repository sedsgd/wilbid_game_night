/* Contenu du site : modifiable sans toucher au moteur. Chaque texte existe en français (fr) et en anglais (en). */
/* Liens entre les pages. Sur GitHub Pages ou en local, on reste dans le dépôt ; ailleurs (versions Claude), on ouvre les artefacts. */
window.WB_LOCAL = location.protocol === 'file:' || location.hostname.endsWith('github.io');
window.WB_LINKS = window.WB_LOCAL ? {
  site: 'index.html', timers: 'minuteurs/index.html', app: 'classement.html',
  partners: 'partenaires.html', dossier: 'documents/dossier-mj/index.html'
} : {
  site: 'https://claude.ai/artifact/2QtXWpNXxMSQ8yavfC1Kc6', timers: 'https://claude.ai/artifact/6mQzfqrQMX5pHaj2fk6MAy',
  app: 'classement.html', partners: 'partenaires.html', dossier: 'https://claude.ai/artifact/Q26Zry3aeHvFVvAFvMXst9'
};
window.WB_TIMERS = window.WB_LINKS.timers;
/* Mentions légales (Impressum, § 5 DDG) : à remplir par la personne responsable du site.
   Tant qu'un champ est vide, la page legal.html affiche « à compléter ». */
window.WB_LEGAL = {
  name: 'Minister Of Enjoyment',  // Prénom Nom de la personne responsable
  street: '',    // Rue et numéro
  city: '91052 Erlangen',  // Code postal et ville
  email: 'delta98@yahoo.com'  // Adresse de contact (aussi utilisée sur la page partenaires)
};
/* Base Supabase (UE, Francfort) : classement en ligne et comptes organisateurs.
   La clé « anon » est publique par conception : la sécurité vient des règles RLS de la base.
   Les artefacts Claude bloquent les connexions externes, donc la base n'est utilisée que sur GitHub Pages ou en local. */
window.WB_SUPABASE = window.WB_LOCAL ? {
  url: 'https://yfawosftdsmrczyecxns.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmYXdvc2Z0ZHNtcmN6eWVjeG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1MDY3MjcsImV4cCI6MjExMTA4MjcyN30.Neyhu_rMhMr822D6LR__t1xRy_l7BNykbwvYbd4SDTc'
} : null;

window.WB_SCHEDULE = [
 {at:'19h30', id:null, fr:'Accueil, badges, cotisation, 10 Kola par joueur', en:'Welcome, badges, fee, 10 Kola per player', d:'30 min'},
 {at:'20h00', id:'mokolo', d:'30 min'},
 {at:'20h40', id:'quiestqui', d:'40 min'},
 {at:'21h25', id:'njangi', d:'30 min'},
 {at:'22h00', id:'duos', d:'45 min'},
 {at:'22h45', id:null, fr:'Repas et musique', en:'Dinner and music', d:'60 min'},
 {at:'23h45', id:'wouri', d:'45 min'},
 {at:'00h40', id:'code', d:'50 min'},
 {at:'01h30', id:null, fr:'Pause', en:'Break', d:'20 min'},
 {at:'01h50', id:'feymen', d:'50 min'},
 {at:'02h45', id:null, fr:'Conversion des Kola, classement, finalistes', en:'Kola conversion, standings, finalists', d:'15 min'},
 {at:'03h00', id:'trone', d:'30 min'},
 {at:'03h30', id:null, fr:'Remise des gains, photo de groupe', en:'Prize-giving, group photo', d:'15 min'},
 {at:'03h45', id:null, fr:'Ambiance libre jusqu’au matin', en:'Party until morning', d:''}
];

window.WB_GAMES = [
{id:'mokolo', num:'1', dur:'30', max:15,
 name:{fr:'Le Marché de Mokolo', en:'Mokolo Market'},
 kind:{fr:'échange et négociation, brise-glace', en:'trading and haggling, icebreaker'},
 fmt:{fr:'individuel', en:'solo'},
 pitch:{fr:'Comme au marché, tout se négocie. Chacun doit réunir une combinaison secrète de marchandises en troquant avec les autres.',
        en:'Like at the market, everything is up for haggling. Everyone must collect a secret set of goods by trading with the others.'},
 rules:{fr:[
  'Chaque joueur pioche 4 cartes marchandise (plantain, ndolé, safou, arachide, macabo, poisson braisé) et 1 carte objectif secrète, par exemple « 4 safous » ou « 4 produits différents ».',
  'Pendant 15 minutes, on échange librement : 1 carte contre 1 carte, avec un peu de Kola en plus si on veut convaincre.',
  'Chaque échange se fait avec une personne différente. Avant d’échanger, on se présente : prénom et ville ou région d’origine au Cameroun.',
  'On peut mentir sur son objectif. On ne peut pas refuser de dire son prénom.',
  'Dès qu’on a son objectif, on le montre au MJ, qui note l’ordre d’arrivée.'],
 en:[
  'Each player draws 4 goods cards (plantain, ndolé, safou, peanut, macabo, grilled fish) and 1 secret goal card, for example “4 safous” or “4 different goods”.',
  'For 15 minutes, trade freely: 1 card for 1 card, with a few Kola on top if you need to be convincing.',
  'Every trade must be with a different person. Before trading, introduce yourself: first name and hometown or region in Cameroon.',
  'You may lie about your goal. You may not refuse to give your first name.',
  'As soon as you complete your goal, show it to the game master, who writes down the finishing order.']},
 score:{fr:[['Objectif atteint','8 PW'],['1er, 2e, 3e à finir','+3, +2, +1 PW'],['Par partenaire d’échange différent (max 4)','+1 PW']],
        en:[['Goal completed','8 PW'],['1st, 2nd, 3rd to finish','+3, +2, +1 PW'],['Per different trading partner (max 4)','+1 PW']]},
 tip:{fr:'Un objectif « 4 identiques » est plus dur, mais tout le monde ne le sait pas : bluffez.', en:'A “4 of a kind” goal is harder, but nobody else knows yours: bluff.'}},

{id:'quiestqui', num:'2', dur:'40', max:15,
 name:{fr:'Qui est qui ?', en:'Who is who?'},
 kind:{fr:'déduction sociale', en:'social deduction'},
 fmt:{fr:'individuel', en:'solo'},
 pitch:{fr:'Retrouver à qui appartient chaque anecdote, en posant des questions malignes.',
        en:'Work out who each story belongs to by asking clever questions.'},
 rules:{fr:[
  'Une semaine avant, chaque inscrit remplit un formulaire anonyme avec 3 anecdotes vraies sur lui. Le MJ en garde une par personne et les numérote.',
  'Le jour J, les anecdotes sont affichées au mur. Chaque joueur reçoit une grille vierge.',
  'Pendant 25 minutes, on circule et on pose des questions. Interdit de demander « c’est toi, l’anecdote 7 ? ». Interdit de mentir. On peut refuser de répondre 2 fois.',
  'Au bout du temps, chacun rend sa grille avec un nom pour chaque anecdote.',
  'Le MJ révèle les réponses une par une, et chaque propriétaire raconte son histoire en 30 secondes.'],
 en:[
  'A week before, everyone fills in an anonymous form with 3 true stories about themselves. The game master keeps one per person and numbers them.',
  'On the night, the stories are posted on the wall. Each player gets a blank grid.',
  'For 25 minutes, walk around and ask questions. You may not ask “is story 7 yours?”. You may not lie. You may refuse to answer twice.',
  'When time is up, hand in your grid with one name for each story.',
  'The game master reveals the answers one by one, and each owner tells their story in 30 seconds.']},
 score:{fr:[['Par bonne réponse (max 12)','1 PW'],['Bonus mystère : moins d’un tiers a trouvé ton anecdote','+3 PW']],
        en:[['Per correct answer (max 12)','1 PW'],['Mystery bonus: less than a third guessed your story','+3 PW']]},
 tip:{fr:'Posez des questions de côté : « tu as déjà vécu à Douala ? » en dit plus qu’on ne croit.', en:'Ask sideways questions: “have you ever lived in Douala?” tells you more than you think.'}},

{id:'njangi', num:'3', dur:'30', max:15,
 name:{fr:'Le Njangi', en:'The Njangi'},
 kind:{fr:'enchères et psychologie', en:'bidding and mind games'},
 fmt:{fr:'individuel', en:'solo'},
 pitch:{fr:'Une tontine où seule la mise la plus haute et unique empoche la bouffe.',
        en:'A savings circle where only the highest unique bid takes the pot.'},
 rules:{fr:[
  'On joue 8 tours.',
  'À chaque tour, chacun cache entre 0 et 4 Kola dans son poing fermé.',
  'Au signal du MJ, tout le monde ouvre la main en même temps. Toutes les Kola misées vont dans la bouffe du tour.',
  'La mise la plus haute que personne d’autre n’a jouée gagne toute la bouffe.',
  'Aucune mise unique ? La bouffe reste pour le tour suivant. Ce qui reste après le tour 8 est perdu.'],
 en:[
  'The game lasts 8 rounds.',
  'Each round, everyone hides 0 to 4 Kola in a closed fist.',
  'On the game master’s signal, everyone opens their hand at the same time. All Kola bid go into the round’s pot.',
  'The highest bid that nobody else played wins the whole pot.',
  'No unique bid? The pot carries over to the next round. Whatever is left after round 8 is lost.']},
 example:{fr:'Trois joueurs misent 4, un seul mise 3 : c’est lui qui gagne.', en:'Three players bid 4, one player bids 3: the 3 wins.'},
 score:{fr:[['Les Kola gagnées','1 Kola = 1 PW à la fin'],['Par tour gagné (max 15)','+2 PW']],
        en:[['Kola won','1 Kola = 1 PW at the end'],['Per round won (max 15)','+2 PW']]},
 tip:{fr:'Tout le monde pense à miser 4. Le 3 gagne plus souvent qu’on ne l’imagine.', en:'Everyone thinks of bidding 4. A 3 wins more often than you would expect.'}},

{id:'duos', num:'4', dur:'45', max:12,
 name:{fr:'Le Carrefour des Duos', en:'Duos Crossroads'},
 kind:{fr:'énigmes à deux, rencontres', en:'puzzles in pairs, meeting people'},
 fmt:{fr:'duos tournants', en:'rotating pairs'},
 pitch:{fr:'Un tête-à-tête de 3 minutes avec presque tout le monde, autour d’une énigme à résoudre ensemble.',
        en:'A 3-minute one-on-one with almost everyone, solving a puzzle together.'},
 rules:{fr:[
  'Deux cercles de chaises, face à face.',
  'À chaque manche, le MJ donne la même énigme à tous les duos : logique, calcul, devinette ou proverbe camerounais à compléter.',
  'Le duo a 3 minutes pour écrire sa réponse sur un papier signé par les deux.',
  'Le cercle extérieur tourne d’une chaise. On joue 9 manches.',
  'À la fin, chacun écrit en secret le nom de son meilleur coéquipier de la soirée.'],
 en:[
  'Two circles of chairs, facing each other.',
  'Each round, the game master gives every pair the same puzzle: logic, maths, a riddle or a Cameroonian proverb to complete.',
  'The pair has 3 minutes to write their answer on a slip signed by both.',
  'The outer circle moves one seat along. 9 rounds in total.',
  'At the end, everyone secretly writes down the name of their best partner of the night.']},
 score:{fr:[['Par énigme résolue, pour chaque membre du duo (max 9)','1 PW'],['Choix réciproque du meilleur coéquipier','+3 PW chacun']],
        en:[['Per puzzle solved, for each partner (max 9)','1 PW'],['Mutual choice of best partner','+3 PW each']]},
 tip:{fr:'Les choix réciproques restent discrets : seuls les deux intéressés sont prévenus.', en:'Mutual choices stay private: only the two people concerned are told.'}},

{id:'wouri', num:'5', dur:'45', max:15,
 name:{fr:'Le Pont du Wouri', en:'Wouri Bridge'},
 kind:{fr:'négociation, alliances et trahison', en:'negotiation, alliances and betrayal'},
 fmt:{fr:'équipes de 3', en:'teams of 3'},
 pitch:{fr:'Toutes les équipes doivent construire ensemble un pont. Celui qui donne peu gagne plus, mais si tout le monde fait pareil, le pont s’effondre.',
        en:'All teams must build one bridge together. Whoever gives little gains more, but if everyone does the same, the bridge collapses.'},
 rules:{fr:[
  'Chaque équipe reçoit 12 planches. On joue 6 tours.',
  'À chaque tour, chaque équipe glisse en secret 0 à 3 planches dans son enveloppe et la remet au MJ.',
  'Le MJ annonce seulement le total. À 10 planches ou plus, le pont tient et chaque équipe reçoit 4 planches de la mairie. Sinon, personne ne reçoit rien et les planches données sont perdues.',
  'Entre deux tours, 3 minutes de négociation : promesses, alliances, menaces. Rien n’oblige à tenir sa parole.',
  'Après le tour 3, une équipe peut payer 1 planche pour que le MJ lui montre en secret ce qu’une autre équipe a donné jusqu’ici.'],
 en:[
  'Each team gets 12 planks. The game lasts 6 rounds.',
  'Each round, each team secretly puts 0 to 3 planks in its envelope and hands it to the game master.',
  'The game master only announces the total. At 10 planks or more, the bridge holds and every team gets 4 planks from the town hall. Otherwise nobody gets anything and the planks given are lost.',
  'Between rounds, 3 minutes of negotiation: promises, alliances, threats. Nobody has to keep their word.',
  'After round 3, a team may pay 1 plank to have the game master secretly show them what another team has given so far.']},
 score:{fr:[['Planches restantes ÷ 2, arrondi au supérieur','PW pour chaque membre'],['Plafond','15 PW']],
        en:[['Planks left ÷ 2, rounded up','PW for each member'],['Cap','15 PW']]},
 tip:{fr:'Une réputation se construit en 2 tours et se perd en 1.', en:'A reputation takes 2 rounds to build and 1 to lose.'}},

{id:'code', num:'6', dur:'50', max:15,
 name:{fr:'Le Code du Chef', en:'The Chief’s Code'},
 kind:{fr:'déduction, échange d’informations, bluff', en:'deduction, information trading, bluff'},
 fmt:{fr:'équipes de 3', en:'teams of 3'},
 pitch:{fr:'Le Chef a caché un code. Toutes les équipes cherchent le même code, et chacune peut vendre ses indices aux autres, vrais ou faux.',
        en:'The Chief has hidden a code. Every team hunts the same code, and each can sell its clues to the others, true or false.'},
 rules:{fr:[
  'Le MJ choisit un code secret de 4 symboles différents parmi 6 : masque, tam-tam, éléphant, lion, case, cabosse de cacao.',
  'Une équipe propose une combinaison sur un papier. Le MJ répond en privé : combien de symboles sont bien placés, combien sont dans le code mais mal placés.',
  'Chaque essai coûte 1 Kola à l’équipe. Au plus 1 essai par minute et par équipe.',
  'Les équipes peuvent échanger ou vendre leurs résultats contre des Kola. On a le droit de mentir.',
  '3 manches de 12 minutes, avec un nouveau code à chaque manche.'],
 en:[
  'The game master picks a secret code of 4 different symbols out of 6: mask, talking drum, elephant, lion, hut, cocoa pod.',
  'A team writes a guess on a slip. The game master answers privately: how many symbols are in the right place, and how many are in the code but in the wrong place.',
  'Each guess costs the team 1 Kola. At most 1 guess per minute per team.',
  'Teams may trade or sell their results for Kola. Lying is allowed.',
  '3 rounds of 12 minutes, with a new code each round.']},
 score:{fr:[['1re équipe à trouver, par manche','5 PW'],['2e équipe','3 PW'],['3e équipe','1 PW']],
        en:[['1st team to crack it, per round','5 PW'],['2nd team','3 PW'],['3rd team','1 PW']]},
 tip:{fr:'Une info achetée se vérifie avec un essai bien choisi avant de s’y fier.', en:'Check a bought clue with one well-chosen guess before you trust it.'}},

{id:'feymen', num:'7', dur:'50', max:15,
 name:{fr:'Les Feymen', en:'The Feymen'},
 kind:{fr:'rôles cachés, bluff, déduction', en:'hidden roles, bluff, deduction'},
 fmt:{fr:'individuel', en:'solo'},
 pitch:{fr:'Des feymen (3 pour 18 joueurs) se cachent parmi les joueurs et arnaquent dans les affaires. Les honnêtes doivent les démasquer en recoupant qui a fait affaire avec qui.',
        en:'Feymen, the con artists (3 for 18 players), hide among the players and cheat in deals. Honest players must unmask them by working out who dealt with whom.'},
 rules:{fr:[
  'Chacun reçoit en secret une carte rôle. Les feymen se reconnaissent pendant que les autres ont les yeux fermés.',
  'Chaque joueur reçoit 6 cartes. Un honnête a 6 « Honnête ». Un feyman a 4 « Honnête » et 2 « Arnaque ».',
  '3 tours. À chaque tour, 5 minutes pour conclure au plus 2 affaires, avec 2 personnes différentes.',
  'Une affaire : les deux écrivent leurs noms sur un contrat, mettent chacun une carte face cachée dans l’enveloppe et la remettent au MJ.',
  'Le MJ annonce les noms des victimes du tour, jamais celui de l’arnaqueur.',
  'Après chaque tour, 3 minutes de débat. À la fin, vote secret : chacun nomme 3 suspects.'],
 en:[
  'Everyone secretly gets a role card. The feymen find each other while everyone else keeps their eyes shut.',
  'Each player gets 6 cards. An honest player has 6 “Honest”. A feyman has 4 “Honest” and 2 “Scam”.',
  '3 rounds. Each round, 5 minutes to close up to 2 deals, with 2 different people.',
  'A deal: both write their names on a contract, each puts one card face down in the envelope, and they hand it to the game master.',
  'The game master announces the names of the round’s victims, never the scammer’s.',
  'After each round, 3 minutes of debate. At the end, secret vote: everyone names 3 suspects.']},
 score:{fr:[['Deux « Honnête »','2 PW chacun'],['Une « Arnaque »','3 PW arnaqueur, 0 victime'],['Deux « Arnaque »','1 PW chacun, rien n’est annoncé'],['Feyman bien nommé par un honnête','+2 PW'],['Feyman nommé par plus de la moitié','perd ses PW du jeu'],['Feyman non démasqué','+5 PW']],
        en:[['Two “Honest”','2 PW each'],['One “Scam”','3 PW to the scammer, 0 to the victim'],['Two “Scam”','1 PW each, nothing announced'],['Feyman correctly named by an honest player','+2 PW'],['Feyman named by more than half','loses their PW for this game'],['Feyman not unmasked','+5 PW']]},
 tip:{fr:'Une victime sait avec qui elle a traité. Croisez les listes avant de voter.', en:'A victim knows who they dealt with. Cross-check the lists before you vote.'}},

{id:'trone', num:'F', fin:true, dur:'30', max:36,
 name:{fr:'Le Trône de Kola', en:'The Kola Throne'},
 kind:{fr:'la finale, bluff et enchères', en:'the final, bluff and bidding'},
 fmt:{fr:'les 4 premiers', en:'top 4 players'},
 pitch:{fr:'Un duel de cartes où il faut deviner ce que les autres vont jouer. Le public parie sur le vainqueur.',
        en:'A card duel where you must guess what the others will play. The crowd bets on the winner.'},
 rules:{fr:[
  'Chaque finaliste a 8 cartes numérotées de 1 à 8.',
  'Le MJ mélange 8 lots valant de 1 à 8 PW et en retourne un par tour.',
  'Les finalistes posent chacun une carte face cachée, puis on révèle en même temps.',
  'La plus haute carte unique gagne le lot. Si deux finalistes jouent la même carte la plus haute, ils s’annulent et la carte unique suivante gagne.',
  'Chaque carte jouée est défaussée. On joue les 8 tours.'],
 en:[
  'Each finalist has 8 cards numbered 1 to 8.',
  'The game master shuffles 8 prizes worth 1 to 8 PW and turns one over each round.',
  'Finalists each play one card face down, then all reveal at once.',
  'The highest unique card wins the prize. If two finalists play the same highest card, they cancel out and the next unique card wins.',
  'Every card played is discarded. All 8 rounds are played.']},
 score:{fr:[['Lots gagnés','36 PW en jeu'],['Pari du public juste','+3 PW au classement']],
        en:[['Prizes won','36 PW at stake'],['Correct crowd bet','+3 PW in the standings']]},
 tip:{fr:'Garder son 8 pour le dernier lot, tout le monde y pense aussi.', en:'Saving your 8 for the last prize? Everyone else is thinking the same.'}}
];
