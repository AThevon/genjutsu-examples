# Checks the drawn sky (takes/sky-check.json probe) against data/stars.json, independently of the
# page's code: the expected place of each body is worked out here from its alt/az, for a chart
# seen from below (zenith at the centre, horizon at the rim, north up, east LEFT), then matched
# to the discs the page drew, and the pixel under each of the ten brightest named stars and
# Saturn is read in the screenshot.
import json, math, sys
from PIL import Image
probe = json.load(open(sys.argv[1]))[-1]['value']
data = json.load(open(sys.argv[2]))
img = Image.open(sys.argv[3]).convert('RGB')
left, top, w, h = probe['box']; s = w / 1000
# The scale is the drawn horizon circle (alt 0), read from the page, not from its code.
C, _ = probe['center']; R = probe['horizon']
print('horizon circle: centre', probe['center'], 'radius', R)
def expect(alt, az, R):
    r = (90 - alt) / 90 * R; a = math.radians(az)
    return C - r * math.sin(a), C - r * math.cos(a)
drawn = probe['stars']
print('discs drawn', len(drawn), 'stars in data', len(data['stars']), 'all bins opacity 1:', all(o == 1 for o in probe['opac']))
pts = []
for st in data['stars']:
    r = (90 - st['alt']) / 90; a = math.radians(st['az'])
    ux, uy = -r * math.sin(a), -r * math.cos(a)
    pts.append((st, ux, uy))
# The nearest drawn disc to each star's expected place.
def match(R):
    out = []
    for st, ux, uy in pts:
        ex, ey = C + ux * R, C + uy * R
        d = min(drawn, key=lambda p: (p[0]-ex)**2 + (p[1]-ey)**2)
        out.append((st, ex, ey, d, math.hypot(d[0]-ex, d[1]-ey)))
    return out
m = match(R)
used = set((d[0], d[1]) for _, _, _, d, _ in m)
print('max offset, data place vs drawn disc (SVG units of 1000):', round(max(x[4] for x in m), 2), '| distinct discs matched:', len(used))
# Orientation, from the data alone: east must be left of centre and north above it.
cap = next(x for x in m if x[0]['name'] == 'Capella'); alt_ = next(x for x in m if x[0]['name'] == 'Altair')
print('Capella (az 40, NE) drawn at', cap[3][:2], '-> upper left:', cap[3][0] < C and cap[3][1] < C)
print('Altair (az 225, SW) drawn at', alt_[3][:2], '-> lower right:', alt_[3][0] > C and alt_[3][1] > C)
sat = data['planets'][0]; ex, ey = expect(sat['alt'], sat['az'], R); sd = probe['saturn'][0]
print('Saturn expected', (round(ex,1), round(ey,1)), 'drawn', sd)
named = sorted([st for st in data['stars'] if st['name']], key=lambda x: x['mag'])[:10]
print('\nThe ten brightest named stars, and Saturn: data alt/az -> expected screen px -> pixel there')
for st in named + [dict(sat, name='Saturn')]:
    ex, ey = expect(st['alt'], st['az'], R)
    X, Y = left + ex * s, top + ey * s
    px = max((img.getpixel((int(X)+dx, int(Y)+dy)) for dx in (-1,0,1) for dy in (-1,0,1)), key=sum)
    lab = next((l for l in probe['labels'] if l[0] == st['name']), None)
    print(f"{st['name']:15s} mag {st['mag']:5.2f} alt {st['alt']:5.1f} az {st['az']:6.1f} -> ({X:6.1f},{Y:6.1f}) brightest px {px}" + (f" label at ({left+lab[1]*s:.0f},{top+lab[2]*s:.0f})" if lab else ''))
bg = img.getpixel((int(left + 520*s), int(top + 470*s)))
print('sky background sample', bg)
