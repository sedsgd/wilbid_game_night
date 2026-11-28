"""Génère le symbole et le logo de la saison 2 (Toghu) en SVG.

Usage : python3 identite-s2/sources/logo.py
Besoin : pip install fonttools brotli
Les PNG sont ensuite rendus par logo-png.js (Playwright).

Le texte des logos est converti en tracés : les fichiers s'ouvrent partout
(PowerPoint, Figma, Canva, imprimeur) sans installer les polices.
"""
import math
import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
POLICES = os.path.join(RACINE, "fonts")
SORTIE = os.path.join(RACINE, "logo")

VELOURS = "#17110E"
COTON = "#F6EBD9"
TOGHU = "#F07A1A"
OR = "#F2B705"
KOLA = "#E0452F"
RAPHIA = "#1E8A5A"

# Géométrie du symbole, dans un carré de 64 unités centré sur (32, 32).
# Même calcul que la fonction en bas de identite-s2/index.html.
ECHELLE_KOLA = 0.64
RAYON_LOBE = 9.2 * ECHELLE_KOLA          # 5,89
DISTANCE_LOBE = 14.142 * ECHELLE_KOLA    # 9,05 : les lobes sont sur les axes
RAYON_INTERIEUR = 18.2                   # pied des rayons, laisse un jour autour de la noix
RAYON_LONG, DEMI_BASE_LONG = 31.0, 1.9   # 8 rayons longs, sur les axes et les diagonales
RAYON_COURT, DEMI_BASE_COURT = 25.5, 1.6 # 8 rayons courts, entre les longs


def f(x):
    return f"{x:.2f}".rstrip("0").rstrip(".")


def rayons():
    d = []
    for i in range(16):
        long = i % 2 == 0
        a = math.radians(i * 22.5)
        r_out = RAYON_LONG if long else RAYON_COURT
        hb = DEMI_BASE_LONG if long else DEMI_BASE_COURT
        ux, uy = math.sin(a), -math.cos(a)   # direction du rayon
        px, py = math.cos(a), math.sin(a)    # perpendiculaire
        tip = (32 + ux * r_out, 32 + uy * r_out)
        b1 = (32 + ux * RAYON_INTERIEUR + px * hb, 32 + uy * RAYON_INTERIEUR + py * hb)
        b2 = (32 + ux * RAYON_INTERIEUR - px * hb, 32 + uy * RAYON_INTERIEUR - py * hb)
        d.append(f"M{f(tip[0])} {f(tip[1])}L{f(b1[0])} {f(b1[1])}L{f(b2[0])} {f(b2[1])}Z")
    return "".join(d)


def lobes():
    out = []
    for cx, cy in ((32, 32 - DISTANCE_LOBE), (32 + DISTANCE_LOBE, 32), (32, 32 + DISTANCE_LOBE), (32 - DISTANCE_LOBE, 32)):
        out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(RAYON_LOBE)}"/>')
    return "".join(out)


def symbole(kola, rayon, avec_rayons=True):
    """Contenu SVG du symbole dans le carré 0 0 64 64."""
    if not avec_rayons:
        # Sans rayons : la noix seule, à pleine taille (comme en saison 1).
        s = 1 / ECHELLE_KOLA
        return f'<g fill="{kola}" transform="translate(32 32) scale({f(s)}) translate(-32 -32)">{lobes()}</g>'
    return f'<path fill="{rayon}" d="{rayons()}"/><g fill="{kola}">{lobes()}</g>'


def police(fichier, wght=None):
    t = TTFont(os.path.join(POLICES, fichier))
    if wght is not None and "fvar" in t:
        t = instantiateVariableFont(t, {"wght": wght})
    return t


def texte(t, chaine, taille, x, y, interlettrage=0.0):
    """Tracé SVG d'une ligne de texte. (x, y) = début de la ligne de base."""
    upm = t["head"].unitsPerEm
    cmap = t.getBestCmap()
    gs = t.getGlyphSet()
    hmtx = t["hmtx"]
    k = taille / upm
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    cur = x
    for ch in chaine:
        g = cmap[ord(ch)]
        tp = TransformPen(pen, (k, 0, 0, -k, cur, y))
        gs[g].draw(tp)
        cur += hmtx[g][0] * k + interlettrage * taille
    return pen.getCommands(), cur - interlettrage * taille


def ecrire(nom, largeur, hauteur, corps, titre):
    os.makedirs(SORTIE, exist_ok=True)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(largeur)} {f(hauteur)}" '
        f'width="{f(largeur)}" height="{f(hauteur)}" role="img" aria-label="{titre}">'
        f"<title>{titre}</title>{corps}</svg>\n"
    )
    with open(os.path.join(SORTIE, nom), "w", encoding="utf-8") as fh:
        fh.write(svg)


def main():
    # Symboles seuls, fond transparent.
    variantes = [
        ("symbole-sur-velours.svg", OR, TOGHU, True, "pour fond sombre"),
        ("symbole-sur-coton.svg", KOLA, VELOURS, True, "pour fond clair"),
        ("symbole-coton.svg", COTON, COTON, True, "une couleur, clair"),
        ("symbole-velours.svg", VELOURS, VELOURS, True, "une couleur, sombre"),
        ("symbole-sans-rayons-or.svg", OR, None, False, "petite taille, fond sombre"),
        ("symbole-sans-rayons-kola.svg", KOLA, None, False, "petite taille, fond clair"),
    ]
    for nom, kola, rayon, avec, usage in variantes:
        ecrire(nom, 64, 64, symbole(kola, rayon, avec), f"Wilbid saison 2, symbole ({usage})")

    syne = police("Syne-800-normal-latin.woff2", 800)
    manrope = police("Manrope-600-normal-latin.woff2", 600)
    gloock = police("Gloock-400-normal-latin.woff2")

    # Logo horizontal : symbole, « wilbid », puis « Game Night » et « saison 2 ».
    # Unités : 1 = 1 px à la taille de référence (hauteur 120).
    def logo(texte_couleur, sous_couleur, saison_couleur, kola, rayon):
        taille_sym = 120
        corps = f'<g transform="scale({f(taille_sym / 64)})">{symbole(kola, rayon)}</g>'
        x0 = taille_sym + 18
        mot, fin = texte(syne, "wilbid", 96, x0, 78, -0.045)
        corps += f'<path fill="{texte_couleur}" d="{mot}"/>'
        gn, fin_gn = texte(manrope, "Game Night", 22, x0 + 4, 110)
        corps += f'<path fill="{sous_couleur}" d="{gn}"/>'
        s2, fin_s2 = texte(gloock, "saison 2", 24, fin_gn + 12, 110)
        corps += f'<path fill="{saison_couleur}" d="{s2}"/>'
        largeur = max(fin, fin_s2) + 6
        return largeur, corps

    for nom, args, usage in [
        ("logo-saison-2-sur-velours.svg", (COTON, "#CDBFA8", OR, OR, TOGHU), "fond sombre"),
        ("logo-saison-2-sur-coton.svg", (VELOURS, "#5E4B3C", KOLA, KOLA, VELOURS), "fond clair"),
    ]:
        w, corps = logo(*args)
        marge = 16  # zone de respiration autour du logo
        corps = f'<g transform="translate({marge} {marge})">{corps}</g>'
        ecrire(nom, w + 2 * marge, 124 + 2 * marge, corps, f"Wilbid Game Night saison 2 ({usage})")

    print("SVG écrits dans", SORTIE)


if __name__ == "__main__":
    main()
