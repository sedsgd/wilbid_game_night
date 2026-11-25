import math
NAVY='#141E4A';CH='#EFEBE1';RED='#D9482F'
def ring():
    s=[f'<circle cx="182" cy="182" r="170" fill="none" stroke="{CH}" stroke-width="9"/>',
       f'<circle cx="182" cy="182" r="137" fill="none" stroke="{CH}" stroke-width="7"/>']
    N=24
    for i in range(N):
        a=2*math.pi*i/N;cx=182+154*math.cos(a);cy=182+154*math.sin(a);d=math.degrees(a)
        s.append(f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({d+90:.1f})"><path d="M0 -12 L10 0 L0 12 L-10 0Z" fill="{CH}"/><path d="M0 -5 L4 0 L0 5 L-4 0Z" fill="{NAVY}"/></g>')
        a2=2*math.pi*(i+.5)/N;x2=182+154*math.cos(a2);y2=182+154*math.sin(a2)
        s.append(f'<circle cx="{x2:.1f}" cy="{y2:.1f}" r="3.6" fill="{CH}"/>')
    return ''.join(s)
def band(x,y,w,h,n=None,col=NAVY):
    # zigzag ndop band inside a shape
    n=n or max(3,int(w/18));step=w/n;pts=[]
    for i in range(n+1):pts.append(f'{x+i*step:.1f},{y+(0 if i%2==0 else h):.1f}')
    return f'<polyline points="{" ".join(pts)}" fill="none" stroke="{col}" stroke-width="3.2" stroke-linejoin="miter"/>'
def diamonds(x,y,w,n,s=7,col=NAVY):
    step=w/n;return ''.join(f'<path d="M{x+step*(i+.5):.1f} {y-s} l{s} {s} l{-s} {s} l{-s} {-s}Z" fill="{col}"/>' for i in range(n))
def kola(cx,cy,r=13,rot=0):
    return f'<g transform="translate({cx} {cy}) rotate({rot})"><ellipse rx="{r}" ry="{r*.82}" fill="{RED}"/><path d="M{-r*.75} 0 Q0 {-r*.25} {r*.75} 0" stroke="{CH}" stroke-width="2.2" fill="none"/></g>'
icons={}
# accueil : calebasse aux kola, offerte en signe de bienvenue
icons['accueil']=f'''
<path d="M92 196 Q182 214 272 196 Q262 270 182 282 Q102 270 92 196Z" fill="{CH}"/>
<path d="M88 192 Q182 212 276 192" stroke="{CH}" stroke-width="9" fill="none" stroke-linecap="round"/>
{band(112,222,140,14,8)}{diamonds(120,252,124,6,6)}
{kola(148,180,17,-15)}{kola(182,172,18,5)}{kola(216,181,17,20)}{kola(166,156,14,-30)}{kola(200,156,14,25)}
<path d="M140 128 q-10 -16 0 -30 M182 122 q-12 -18 0 -36 M224 128 q10 -16 0 -30" stroke="{CH}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M166 96 l8 -8 l8 8 l-8 8z" fill="{RED}"/>'''
# repas : marmite fumante
icons['repas']=f'''
<path d="M98 168 H266 V178 Q262 262 182 268 Q102 262 98 178Z" fill="{CH}"/>
<rect x="86" y="156" width="192" height="16" rx="8" fill="{CH}"/>
<path d="M98 186 h-22 a10 10 0 0 0 0 20 h24 M266 186 h22 a10 10 0 0 1 0 20 h-24" stroke="{CH}" stroke-width="8" fill="none" stroke-linecap="round"/>
{band(112,196,140,16,8)}{diamonds(122,234,120,5,7)}
<path d="M152 276 l-10 14 M212 276 l10 14 M182 278 v14" stroke="{CH}" stroke-width="8" stroke-linecap="round"/>
<path d="M140 142 q-14 -20 0 -38 q12 -18 0 -36 M182 140 q-14 -22 0 -42 q12 -18 0 -36 M224 142 q-14 -20 0 -38 q12 -18 0 -36" stroke="{CH}" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse cx="182" cy="150" rx="60" ry="7" fill="{RED}"/>'''
# pause : sablier
icons['pause']=f'''
<rect x="112" y="84" width="140" height="18" rx="6" fill="{CH}"/><rect x="112" y="262" width="140" height="18" rx="6" fill="{CH}"/>
<rect x="120" y="102" width="9" height="160" fill="{CH}"/><rect x="235" y="102" width="9" height="160" fill="{CH}"/>
<path d="M140 108 H224 Q224 160 186 182 Q224 204 224 256 H140 Q140 204 178 182 Q140 160 140 108Z" fill="none" stroke="{CH}" stroke-width="7" stroke-linejoin="round"/>
<path d="M156 134 H208 Q200 160 182 172 Q164 160 156 134Z" fill="{RED}"/>
<path d="M150 250 Q182 214 214 250Z" fill="{RED}"/><path d="M182 182 v50" stroke="{RED}" stroke-width="3" stroke-dasharray="4 5"/>
{diamonds(112,93,140,7,4.5)}{diamonds(112,271,140,7,4.5)}'''
# classement : podium avec la kola au sommet
icons['classement']=f'''
<rect x="148" y="160" width="68" height="110" fill="{CH}"/><rect x="82" y="196" width="66" height="74" fill="{CH}"/><rect x="216" y="214" width="66" height="56" fill="{CH}"/>
<rect x="72" y="270" width="220" height="12" rx="4" fill="{CH}"/>
<text x="182" y="215" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="44" fill="{NAVY}">1</text>
<text x="115" y="244" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="{NAVY}">2</text>
<text x="249" y="256" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="30" fill="{NAVY}">3</text>
{band(150,232,64,12,4)}{diamonds(84,262,62,3,5)}{diamonds(218,262,62,3,5)}
{kola(182,132,22,-8)}
<path d="M150 108 l-12 -12 M214 108 l12 -12 M182 98 v-18" stroke="{CH}" stroke-width="6" stroke-linecap="round"/>
<path d="M108 178 l7 -7 l7 7 l-7 7z M242 196 l7 -7 l7 7 l-7 7z" fill="{CH}"/>'''
# gains : bourse de la cagnotte et pièces
icons['gains']=f'''
<path d="M150 118 Q182 132 214 118 L204 146 Q258 176 254 228 Q250 276 182 278 Q114 276 110 228 Q106 176 160 146Z" fill="{CH}"/>
<path d="M150 146 H214" stroke="{RED}" stroke-width="9" stroke-linecap="round"/>
<path d="M214 146 q18 4 22 -12 M150 146 q-18 4 -22 -12" stroke="{RED}" stroke-width="6" fill="none" stroke-linecap="round"/>
{band(128,196,108,14,6)}{diamonds(134,240,96,4,7)}
<g fill="{CH}"><ellipse cx="110" cy="270" rx="26" ry="9"/><rect x="84" y="250" width="52" height="20"/><ellipse cx="110" cy="250" rx="26" ry="9"/>
<ellipse cx="254" cy="270" rx="26" ry="9"/><rect x="228" y="238" width="52" height="32"/><ellipse cx="254" cy="238" rx="26" ry="9"/></g>
<path d="M86 260 H134 M230 250 H278 M230 260 H278" stroke="{NAVY}" stroke-width="2.5"/>
<path d="M172 100 l10 -10 l10 10 l-10 10z" fill="{RED}"/>'''
# ambiance : tam-tam et notes
icons['ambiance']=f'''
<ellipse cx="182" cy="116" rx="56" ry="15" fill="{RED}"/>
<path d="M126 116 Q132 170 160 196 L150 270 H214 L204 196 Q232 170 238 116" fill="{CH}"/>
<ellipse cx="182" cy="116" rx="56" ry="15" fill="none" stroke="{CH}" stroke-width="6"/>
<path d="M132 132 L160 196 M232 132 L204 196 M150 128 L172 194 M214 128 L192 194" stroke="{NAVY}" stroke-width="3"/>
{band(158,212,48,12,4)}{diamonds(154,256,56,3,6)}
<path d="M160 196 H204" stroke="{NAVY}" stroke-width="4"/>
<g fill="{CH}"><ellipse cx="88" cy="172" rx="12" ry="9" transform="rotate(-20 88 172)"/><rect x="96" y="112" width="5" height="60"/><path d="M96 112 q22 6 26 26 q-10 -12 -26 -12z"/>
<ellipse cx="262" cy="196" rx="12" ry="9" transform="rotate(-20 262 196)"/><ellipse cx="294" cy="186" rx="12" ry="9" transform="rotate(-20 294 186)"/><rect x="270" y="136" width="5" height="60"/><rect x="302" y="126" width="5" height="60"/><path d="M270 136 L307 126 V136 L275 146Z"/></g>'''
# kongossa : enveloppe de missions scellée d'une kola, et le chuchotement
icons['kongossa']=f'''
<rect x="88" y="132" width="188" height="122" rx="8" fill="{CH}"/>
<path d="M92 136 L182 206 L272 136" stroke="{NAVY}" stroke-width="6" fill="none" stroke-linejoin="round"/>
<path d="M92 250 L158 196 M272 250 L206 196" stroke="{NAVY}" stroke-width="4" fill="none"/>
{diamonds(118,238,128,5,6)}
<circle cx="182" cy="206" r="24" fill="{RED}"/><path d="M164 206 Q182 199 200 206" stroke="{CH}" stroke-width="2.6" fill="none"/>
<circle cx="182" cy="206" r="24" fill="none" stroke="{CH}" stroke-width="3" stroke-dasharray="3 4"/>
<circle cx="150" cy="104" r="7" fill="{CH}"/><circle cx="182" cy="98" r="7" fill="{CH}"/><circle cx="214" cy="104" r="7" fill="{CH}"/>
<path d="M118 112 q-14 -14 -8 -32 M252 80 q8 18 -6 32" stroke="{CH}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M174 276 l8 -8 l8 8 l-8 8z" fill="{RED}"/>'''
tex='''<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="4" seed="7" result="n"/>
<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 5.3" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
<filter id="bgn"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .05 0"/></filter>'''
for k,v in icons.items():
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="364" height="364" viewBox="0 0 364 364"><defs>{tex}</defs><rect width="364" height="364" fill="{NAVY}"/><rect width="364" height="364" filter="url(#bgn)"/><g filter="url(#grain)">{ring()}<g transform="translate(182 182) scale(1.04) translate(-182 -182)">{v}</g></g></svg>'
    open(f'/tmp/emb/em-{k}.svg','w').write(svg)
print('ok')
