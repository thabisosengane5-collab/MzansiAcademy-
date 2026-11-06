# -*- coding: utf-8 -*-
# Drawing helpers for lesson illustrations (the `svg` field of a lesson: 400x220, dark theme).
# Usage — write a small script next to your content work:
#   import sys; sys.path.insert(0, 'tools/illustrations'); from svglib import *
#   S = {}
#   S['m0-0'] = svg(title('INPUT → PROCESS → OUTPUT'), steps(['IN','PROCESS','OUT'], [G, Y, T]), quote('tills · ATMs · phones'))
#   save(S, 'my_svgs.js')        # then paste or load the strings into content/lessons/<sid>.js
#   preview(S, 'preview.html')   # then: node tools/illustrations/preview.js preview.html out-dir
# Colours: G green, T teal, Y gold, O orange, P purple, B blue, TX text, M muted. Text is escaped by t().
import json, math
from xml.sax.saxutils import escape as X
W,H=400,220
BG='#0d1024'; G='#00D68F'; T='#00C2D4'; Y='#FFB800'; O='#FF6B35'; P='#A855F7'; TX='#E2E8F0'; M='#64748B'; GR='#1E293B'
F='font-family="Plus Jakarta Sans,Arial,sans-serif"'

def svg(*parts): return f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg"><rect width="{W}" height="{H}" fill="{BG}"/>'+''.join(parts)+'</svg>'
def t(x,y,s,c=TX,size=13,anchor='start',weight=600,italic=False):
    s=s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
    return f'<text x="{x:.1f}" y="{y:.1f}" fill="{c}" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}"{" font-style=\"italic\"" if italic else ""} {F}>{s}</text>'
def ln(x1,y1,x2,y2,c=M,w=1.5,dash=None): return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{c}" stroke-width="{w}"'+(f' stroke-dasharray="{dash}"' if dash else '')+' stroke-linecap="round"/>'
def rc(x,y,w,h,c=G,fill='none',r=4,sw=2,op=1): return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" fill="{fill}" stroke="{c}" stroke-width="{sw}" opacity="{op}"/>'
def ci(x,y,r,c=G,fill='none',sw=2): return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}" stroke="{c}" stroke-width="{sw}"/>'
def dot(x,y,c=Y,r=4): return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{c}"/>'
def path(pts,c=G,w=2.5,fill='none',close=False,dash=None,op=1):
    d='M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in pts)+(' Z' if close else '')
    return f'<path d="{d}" fill="{fill}" stroke="{c}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round" opacity="{op}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def poly(pts,fill,op=0.25): return f'<path d="M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in pts)+f' Z" fill="{fill}" opacity="{op}"/>'
def title(s,c=T): return t(16,24,s,c,12,weight=700)

class Plot:
    def __init__(s,x0,x1,y0,y1,box=(40,30,340,160)):
        s.x0,s.x1,s.y0,s.y1=x0,x1,y0,y1; s.bx,s.by,s.bw,s.bh=box
    def X(s,x): return s.bx+(x-s.x0)/(s.x1-s.x0)*s.bw
    def Y(s,y): return s.by+s.bh-(y-s.y0)/(s.y1-s.y0)*s.bh
    def P(s,x,y): return (s.X(x),s.Y(y))
    def curve(s,f,a,b,n=120,**k):
        pts=[]
        for i in range(n+1):
            x=a+(b-a)*i/n; y=f(x)
            if s.y0-1e9<y<s.y1+1e9: pts.append(s.P(x,max(min(y,s.y1+(s.y1-s.y0)*.05),s.y0-(s.y1-s.y0)*.05)))
        return path(pts,**k)
    def axes(s,xl='',yl='',ox=0,oy=0):
        out=ln(s.bx,s.Y(oy),s.bx+s.bw,s.Y(oy),M,1.2)+ln(s.X(ox),s.by,s.X(ox),s.by+s.bh,M,1.2)
        if xl: out+=t(s.bx+s.bw,s.Y(oy)+14,xl,M,10,'end',500)
        if yl: out+=t(s.X(ox)+4,s.by+8,yl,M,10,'start',500)
        return out


B='#3B9EFF'
B='#3B9EFF'
def arrow(x1,y1,x2,y2,c=Y,w=2.5,head=8):
    a=math.atan2(y2-y1,x2-x1); h1=(x2-head*math.cos(a-0.45),y2-head*math.sin(a-0.45)); h2=(x2-head*math.cos(a+0.45),y2-head*math.sin(a+0.45))
    return path([(x1,y1),(x2,y2)],c,w)+path([h1,(x2,y2),h2],c,w)
def chip(x,y,w,label,c,sub=None,h=30,fs=12):
    o=rc(x,y,w,h,c,'rgba(255,255,255,.04)',6,2)+t(x+w/2,y+h/2+5,label,c,fs,'middle',800)
    if sub: o+=t(x+w/2,y+h+16,sub,TX,10,'middle',600)
    return o
def box(x,y,w,h,c,head,lines):
    o=rc(x,y,w,h,c,'rgba(255,255,255,.04)',8,2)+t(x+w/2,y+22,head,c,12,'middle',800)
    for i,l in enumerate(lines): o+=t(x+w/2,y+44+i*17,l,TX,10,'middle',700)
    return o
def quote(s,c=Y,y=205): return t(200,y,s,c,11,'middle',800)
def steps(labels,cols,y=80,sub=None,fs=12):
    n=len(labels); w=(360-(n-1)*14)/n; o=''
    for i,(l,c) in enumerate(zip(labels,cols)):
        x=20+i*(w+14); o+=chip(x,y,w,l,c,sub[i] if sub else None,fs=fs)
        if i<n-1: o+=arrow(x+w+2,y+15,x+w+12,y+15,M,2,5)
    return o
def cell(x,y,w,h,s,c=TX,fill='none',sc='#334155',fs=10,anchor='middle',weight=700):
    tx=x+w/2 if anchor=='middle' else (x+w-5 if anchor=='end' else x+5)
    return rc(x,y,w,h,sc,fill,0,1)+t(tx,y+h/2+4,s,c,fs,anchor,weight)
def timeline(items, y=115, cols=None):
    o=ln(30,y,370,y,M,2); n=len(items); step=340/(n)
    for i,(d,lab) in enumerate(items):
        x=30+step*(i+.5); c=(cols or [T,Y,G,O,P])[i%5]; up=i%2==0
        o+=dot(x,y,c,6)+t(x,y-18 if up else y+28,d,c,11,'middle',800)+t(x,y-34 if up else y+44,lab,TX,10,'middle',600)
    return o
def codewin(x,y,w,h,lines,head='index.html'):
    o=rc(x,y,w,h,'#334155','#0b1220',8,1.5)+rc(x,y,w,22,'#334155','#111b2e',8,1.5)
    o+=dot(x+12,y+11,'#FF5F57',4)+dot(x+24,y+11,'#FEBC2E',4)+dot(x+36,y+11,'#28C840',4)+t(x+50,y+15,head,M,9,weight=600)
    for i,(s,c) in enumerate(lines): o+=f'<text x="{x+10:.1f}" y="{y+38+i*14:.1f}" fill="{c}" font-size="10" font-family="JetBrains Mono,Consolas,monospace" font-weight="600" xml:space="preserve">{X(s)}</text>'
    return o
def browser(x,y,w,h,url='mzansi.dev'):
    return rc(x,y,w,h,'#334155','#f8fafc',8,1.5)+rc(x,y,w,20,'#334155','#e2e8f0',8,1.5)+rc(x+30,y+5,w-40,11,'#cbd5e1','#ffffff',5,1)+t(x+36,y+14,url,'#475569',8,weight=600)

def save(S, out):
    """Write {key: svg} as a JS object literal so it can be pasted into a lesson file."""
    with open(out, 'w', encoding='utf-8') as f:
        f.write('var SVGS=' + json.dumps(S, ensure_ascii=False, indent=0) + ';\n')

def preview(S, out):
    """One HTML page showing every illustration at real size, labelled by key."""
    cards = ''.join(f'<figure><figcaption>{X(k)}</figcaption>{v}</figure>' for k, v in S.items())
    with open(out, 'w', encoding='utf-8') as f:
        f.write('<!doctype html><meta charset="utf-8"><style>body{background:#111;color:#ccc;font:12px sans-serif;display:flex;flex-wrap:wrap;gap:12px}'
                'figure{margin:0;width:400px}svg{width:400px;height:220px;display:block}</style>' + cards)
