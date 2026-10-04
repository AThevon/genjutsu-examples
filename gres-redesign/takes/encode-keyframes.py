# usage: enc2.py <framesdir> <src_fps> <fps> <quality> <out> <start> <end> <width>
import sys,os
from PIL import Image
d,src,fps,q,out,a,b,W=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),sys.argv[5],int(sys.argv[6]),int(sys.argv[7]),int(sys.argv[8])
fr=sorted(f for f in os.listdir(d) if f.endswith('.png'))[a:b if b>0 else None]
n=round(len(fr)*fps/src); pick=[fr[min(len(fr)-1,round(k*src/fps))] for k in range(n)]
ims=[]
for f in pick:
    im=Image.open(os.path.join(d,f)).convert('RGB'); H=round(im.height*W/im.width/2)*2
    ims.append(im.resize((W,H),Image.LANCZOS))
dur=[round((k+1)*1000/fps)-round(k*1000/fps) for k in range(n)]
ims[0].save(out,save_all=True,append_images=ims[1:],duration=dur,loop=0,quality=q,method=6,lossless=False,kmin=0,kmax=1)
print(out,n,sum(dur),ims[0].size,os.path.getsize(out))
