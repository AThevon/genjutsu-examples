#!/usr/bin/env python3
# Re-encodes the clip from the frames record.mjs kept (takes/clip.json, --keep-frames): frames resized
# with `magick <frame> -resize 600x375! -strip` into $RD, picked at 8 fps on the clip clock, runs of identical
# frames merged. Used for media/clip.webp (RD=r600, -quality 28) and media/clip-1200.webp (RD=r1200, -quality 40).
# Usage: RD=<frames dir> python3 encode-clip.py <fps> <out.webp> [magick options...]
S=os.path.dirname(os.path.abspath(__file__))
frames=sorted(os.listdir(S+'/'+os.environ.get('RD','r1200')))
fps_in=24
def build(rate, extra, out):
    # pick frames on the clip's clock, then merge runs of identical frames
    n=len(frames); picked=[]
    k=0
    while True:
        i=round(k*fps_in/rate)
        if i>=n: break
        picked.append(frames[i]); k+=1
    seq=[]
    for idx,f in enumerate(picked):
        h=hashlib.md5(open(S+'/'+os.environ.get('RD','r1200')+'/'+f,'rb').read()).hexdigest()
        t0=round(idx*1000/rate); t1=round((idx+1)*1000/rate)
        if seq and seq[-1][2]==h: seq[-1][1]+=t1-t0
        else: seq.append([f,t1-t0,h])
    args=['magick','-loop','0']
    for f,d,h in seq: args+=['-delay',f'{d}x1000',S+'/'+os.environ.get('RD','r1200')+'/'+f]
    args+=extra+[out]
    subprocess.run(args,check=True)
    return len(seq), sum(d for _,d,_ in seq), os.path.getsize(out)//1024
if __name__=='__main__':
    rate=float(sys.argv[1]); out=sys.argv[2]; extra=sys.argv[3:]
    print(rate, extra, build(rate, extra, out))
