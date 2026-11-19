import re,json,io,os,collections
from pptx import Presentation
from docx import Document
from PIL import Image
O='/mnt/user-data/outputs/site/'
P=Presentation('/mnt/user-data/uploads/Chourasia_Research_Portfolio_Final_17112026__1_.pptx')
TAGS={'EXPERIMENTAL','NUMERICAL','TECHNOLOGICAL','SOCIETAL','NATIONAL','INTERNATIONAL'}
def info(i):
    s=P.slides[i-1]; tx=[]
    for sh in s.shapes:
        if sh.has_text_frame:
            for t in sh.text_frame.text.split('\n'):
                t=t.strip()
                if t and t not in TAGS and not re.fullmatch(r'\d{1,2}|PI|00',t): tx.append(t)
    return tx
def pics(i):
    out=[]
    for sh in P.slides[i-1].shapes:
        if sh.shape_type==13 and sh.width>1500000 and sh.height>1000000:
            out.append((sh.width*sh.height,sh))
    return [s for _,s in sorted(out,key=lambda x:-x[0])]
def save(sh,path,w=1100):
    im=Image.open(io.BytesIO(sh.image.blob)).convert('RGB'); im.thumbnail((w,w)); im.save(O+path,quality=70,optimize=True); return im.size
SEC=[('infra','Research Infrastructure',13,15),('expt','Experimental & Numerical Studies',16,28),('3dcp','3D Concrete Printing',29,37),('act','Advanced Construction Techniques',38,42),('seismic','Seismic Risk & Vulnerability Assessment',43,49),('shm','Structural Health Assessment & Rehabilitation',50,54),('heritage','Heritage Structures & Conservation',55,63),('post','Post-Disaster Reconstruction',64,70),('social','Social Impact & Capacity Building',71,83),('leader','Leadership & Recognition',9,12),('overview','Overview',2,3)]
D={'research':[]}
seen=set()
for key,title,a,b in SEC:
    slides=[];imgs=[];n=0
    for i in range(a,b+1):
        tx=info(i)
        if len(tx)<2: continue
        head=tx[1] if len(tx)>1 else tx[0]
        lines=[t[:170] for t in tx[2:] if len(t)>=28][:4]
        slides.append({'n':i,'h':head[:160],'l':lines})
        for sh in pics(i)[:3]:
            if len(imgs)>=9: break
            h=hash(sh.image.sha1)
            if h in seen: continue
            seen.add(h); n+=1; p=f'assets/img/{key}-{n:02d}.jpg'; save(sh,p); imgs.append(p)
    D['research'].append({'id':key,'title':title,'slides':slides,'imgs':imgs})
# slideshow
cand=[]
for i in range(2,84):
    for sh in pics(i):
        r=sh.width/sh.height
        if 1.3<r<2.1 and sh.width>3000000: cand.append((sh.width*sh.height,i,sh))
cand.sort(key=lambda x:-x[0]); used=set(); show=[]; per=collections.Counter()
for _,i,sh in cand:
    if len(show)>=8: break
    h=sh.image.sha1
    if h in used or per[i//8]>=2: continue
    used.add(h); per[i//8]+=1
    k=len(show)+1; p=f'assets/slideshow/slide-{k:02d}.jpg'
    im=Image.open(io.BytesIO(sh.image.blob)).convert('RGB'); w,hh=im.size
    th=int(w*9/16)
    if th<=hh: t=(hh-th)//2; im=im.crop((0,t,w,t+th))
    else: tw=int(hh*16/9); l=(w-tw)//2; im=im.crop((l,0,l+tw,hh))
    im.thumbnail((1280,720)); im.save(O+p,quality=72,optimize=True)
    sec=next((s[1] for s in SEC if s[2]<=i<=s[3]),'Research'); show.append({'src':p,'alt':f'Field and laboratory work: {sec}','caption':sec})
D['slideshow']=show
# awards images (slides 10-12 already in leader)
# docs
def parse(f,heads):
    d=Document('/mnt/user-data/uploads/'+f); cur=None; res=collections.OrderedDict(); 
    for p in d.paragraphs:
        t=re.sub(r'\s+',' ',p.text).strip()
        if not t: continue
        k=next((h for h in heads if t.lower().strip(' ‘’\'')==h.lower().strip(' ‘’\'')),None)
        if k: cur=k; res[k]=[]; continue
        if cur: res[cur].append(t)
    return res
def year(t):
    m=re.findall(r'\b(19[89]\d|20[0-3]\d)\b',t); return int(m[-1]) if m else None
def doi(t):
    m=re.search(r'https?://\S+',t)
    if m: return m.group(0).rstrip('.,;)')
    m=re.search(r'\b10\.\d{4,9}/[^\s,;]+',t); return 'https://doi.org/'+m.group(0).rstrip('.,;)') if m else None
ST=re.compile(r'\b(Accepted|In[- ]?Print|In press|Submitted|Under review|Communicated)\b',re.I)
PH=['Books Published','Chapter in Books','Papers in International Journals','Papers Published in National Journals','Papers Published in International & National Seminars, Symposia and Conferences','Technical Document','Technical Broucher','Documentary','Patents Filed','Technology Transfer','Industrial Meet','Training Programs & Lectures Delivered (in core domain of S,T&I)']
pubs=parse('2__Annex_I_List_of_Publications.docx',PH)
TABS={'Papers in International Journals':'intl','Papers Published in International & National Seminars, Symposia and Conferences':'conf','Papers Published in National Journals':'natl','Books Published':'books','Chapter in Books':'chap','Technical Document':'tech','Technical Broucher':'broch','Documentary':'doc'}
EX=['Patents Filed','Technology Transfer','Industrial Meet','Training Programs & Lectures Delivered (in core domain of S,T&I)']
out=[];dup=collections.defaultdict(list);ids=0
for h,items in pubs.items():
    tab=TABS.get(h,'extra')
    for t in items:
        ids+=1; m=ST.search(t); e={'id':f'P{ids}','tab':tab,'sub':h if tab=='extra' else '','text':t,'year':year(t),'doi':doi(t),'status':m.group(1).title() if m else None}
        out.append(e); dup[re.sub(r'\W','',t.lower())[:90]].append(e['id'])
D['pubs']=out
SP=['NDMA','MoHUA','MoRD','MEA','MoES','CSIR','DST','UNDP','European Commission','AAI','NTPC','CPWD','DDA','ASI','Supreme Court','BARC','IGCAR','IOCL','SDMA','BMTPC','Planning Commission','Ministry of Home Affairs','DRDO','HUDCO','NHAI','ISRO','SERB','AcSIR']
PRH=['International Projects','Game Changing’ R&D Projects','R & D Projects','Sponsored Research Projects','Developmental Projects']
pr=parse('3__Annex_II_list_of_projects.docx',PRH)
PT=dict(zip(PRH,['intl','game','rd','spons','dev']))
pj=[];n=0
for h,items in pr.items():
    for t in items:
        n+=1; a=re.search(r'(?:Rs\.?|₹)\s?[\d,.]+\s?(?:lakhs?|crores?|cr\.?)',t,re.I); per=re.search(r'\b(?:19|20)\d\d(?:\s?[-–]\s?(?:\d{2}|\d{4}))?\b',t)
        sp=[s for s in SP if re.search(r'\b'+re.escape(s)+r'\b',t)]
        pj.append({'id':f'J{n}','tab':PT[h],'text':t,'period':per.group(0) if per else None,'year':year(t),'amount':a.group(0) if a else None,'sponsor':sp[0] if sp else 'Other / not stated'})
        dup[re.sub(r'\W','',t.lower())[:90]].append(f'J{n}')
D['projects']=pj
D['dups']=[v for v in dup.values() if len(v)>1]
open(O+'data.js','w').write('window.DATA='+json.dumps(D,ensure_ascii=False)+';')
print({k:len(v) for k,v in pubs.items()}); print({k:len(v) for k,v in pr.items()}); print('dups',D['dups'][:8],len(D['dups']))
print('noyear',sum(1 for e in out if not e['year']),sum(1 for e in pj if not e['year']))
print([ (s['id'],len(s['imgs']),len(s['slides'])) for s in D['research']], len(show))
