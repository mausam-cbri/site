const CFG={name:'Chourasia',email:'ajayc.cbri@csir.res.in' /* REPLACE ME: email */,phone:'09897209050' /* REPLACE ME: phone */,
links:[['Vidwan','https://vidwan.inflibnet.ac.in/profile/749128'],['ResearchGate','https://www.researchgate.net/profile/Ajay-Chourasia/research'],['ORCID','https://orcid.org/0000-0001-6595-2465']]};
const D=window.DATA,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* carousel */
const S=D.slideshow;let cur=0,timer,stage=$('#stage');
S.forEach((s,i)=>stage.insertAdjacentHTML('beforeend',`<figure class="slide" data-i="${i}"><img src="${s.src}" alt="${esc(s.alt)}" ${i?'loading="lazy"':''}><figcaption>${esc(s.caption)}</figcaption></figure>`));
$('#dots').innerHTML=S.map((_,i)=>`<button aria-label="Slide ${i+1}"></button>`).join('');
function show(n){cur=(n+S.length)%S.length;$$('.slide').forEach((el,i)=>{let d=((i-cur+S.length+S.length/2)%S.length)-S.length/2;const a=Math.abs(d),w=stage.clientWidth*(innerWidth<700?.84:.62);
el.style.transform=`translateX(calc(-50% + ${d*w*(innerWidth<700?.9:.55)}px)) scale(${a?.8:1})`;el.style.opacity=a==0?1:a==1?.65:0;el.style.filter=a?'blur(3px)':'none';el.style.zIndex=10-a;el.style.pointerEvents=a?'none':'auto';el.setAttribute('aria-hidden',a?'true':'false')});
$$('#dots button').forEach((b,i)=>b.setAttribute('aria-current',i==cur))}
const play=()=>{clearInterval(timer);if(!RM)timer=setInterval(()=>show(cur+1),5000)};
$('#prev').onclick=()=>{show(cur-1);play()};$('#next').onclick=()=>{show(cur+1);play()};$$('#dots button').forEach((b,i)=>b.onclick=()=>{show(i);play()});
const car=$('.car');car.addEventListener('mouseenter',()=>clearInterval(timer));car.addEventListener('mouseleave',play);car.addEventListener('touchstart',e=>{clearInterval(timer);car._x=e.touches[0].clientX},{passive:true});
car.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-car._x;if(Math.abs(dx)>40)show(cur+(dx<0?1:-1));play()});
car.tabIndex=0;car.addEventListener('keydown',e=>{if(e.key=='ArrowLeft')show(cur-1);if(e.key=='ArrowRight')show(cur+1)});addEventListener('resize',()=>show(cur));show(0);play();
/* content */
const R=Object.fromEntries(D.research.map(r=>[r.id,r]));
const NUMS=[['60+','papers in international journals (+4 accepted / in press, +18 under review)'],['108+','conference & symposium papers'],['161','projects, ₹217.4 crore external funding catalysed, 2015–25'],['₹83 crore','Nepal reconstruction, MEA: 218 post-earthquake projects'],['60,000','trained through 500+ programmes: 40,000 engineers and 20,000 masons'],['10 lakh','multi-hazard resistant houses built under PMAY-G in Odisha'],['5.2 crore','twin-pit rural latrines constructed nationwide (Swachh Bharat Mission)'],['40,000+','confined-masonry buildings implemented in UP, Bihar, Uttarakhand, Himachal, Odisha']];
const gal=r=>r.imgs.length?`<div class="gal">${r.imgs.map((s,i)=>`<img src="${s}" loading="lazy" alt="${esc(r.title)} photo ${i+1}">`).join('')}</div>`:'';
function body(r){const ss=r.slides,first=ss.find(s=>s.l.length);
return `<h3 tabindex="-1">${esc(r.title)}</h3>${first?`<p>${esc(first.l.slice(0,2).join(' '))}</p>`:''}<h4>Highlights</h4><ul>${ss.filter(s=>s.l.length).slice(0,6).map(s=>`<li><b>${esc(s.h)}</b>: ${esc(s.l[0])}</li>`).join('')}</ul>${gal(r)}`}
const numPanel=()=>`<h3 tabindex="-1">Key numbers</h3><div class="nums">${NUMS.map(n=>`<div class="num"><b data-c="${esc(n[0])}">${esc(n[0])}</b><span>${esc(n[1])}</span></div>`).join('')}</div>`;
const SECS=[
{id:'overview',t:'Overview',e:'Who I am',d:'Profile, vision and expertise at a glance.',one:()=>body(R.overview)},
{id:'perf',t:'Performance Indicators & Engagements',e:'Track record',d:'Headline numbers, leadership and recognition.',cards:[{id:'perf-numbers',t:'Key Numbers',s:'Output, funding and impact',img:R.overview.imgs[0],h:numPanel},{id:'perf-leadership',t:'Leadership & Awards',s:'Honours and expert bodies',img:R.leader.imgs[0],h:()=>body(R.leader)}]},
{id:'research',t:'Research Development & Innovation',e:'What I work on',d:'Eight research themes, each from lab to field.',cards:D.research.filter(r=>!['overview','leader','social'].includes(r.id)).map(r=>({id:'research-'+r.id,t:r.title,s:(r.slides.find(x=>x.l.length)||{h:''}).h,img:r.imgs[0],h:()=>body(r)}))},
{id:'social',t:'Social Impact & Capacity Building',e:'Beyond the lab',d:'Impact stories, training and capacity-building programmes.',one:()=>body(R.social)}];
const TABS={pubs:[['intl','International Journal Papers'],['conf','Conference & Symposium Papers'],['natl','National Journal Papers'],['books','Books & Editions'],['chap','Book Chapters'],['tech','Technical Documents'],['broch','Design Tools & Brochures'],['doc','Documentaries'],['extra','Patents & Technology Transfer']],
projects:[['intl','International Projects'],['game','Game-Changing Projects'],['rd','R&D Projects'],['spons','Sponsored Research Projects'],['dev','Developmental Projects']]};
const NAV=[['overview','Overview'],['perf','Performance Indicators & Engagements',[['perf-numbers','Key Numbers'],['perf-leadership','Leadership & Awards']]],['research','Research Development & Innovation',SECS[2].cards.map(c=>[c.id,c.t])],['social','Social Impact & Capacity Building'],['output','Research Output',TABS.pubs.map(t=>['output-'+t[0],t[1]])],['projects','Projects',TABS.projects.map(t=>['projects-'+t[0],t[1]])],['contact','Contact']];
const M=$('#main');const head=s=>`<h2>${s.t}</h2><p class="sub">${s.d}</p>`;
SECS.forEach(s=>{let h=`<section class="sec rv" id="${s.id}" aria-labelledby="${s.id}-h"><div class="wrap">${head(s).replace('<h2>',`<h2 id="${s.id}-h">`)}`;
h+=s.one?`<div class="panel">${s.one()}</div>`:`<div class="grid">${s.cards.map(c=>`<button class="card" id="${c.id}" aria-expanded="false" aria-haspopup="dialog">${c.img?`<img src="${c.img}" loading="lazy" alt="">`:''}<b>${esc(c.t)}</b><span>${esc(c.s)}</span></button>`).join('')}</div><div class="panel-host"></div>`;M.insertAdjacentHTML('beforeend',h+'</div></section>')});
/* accordion */
const modal=document.createElement('div');modal.className='modal';modal.hidden=true;
modal.innerHTML='<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="mh"><h3 id="mt"></h3><button class="mx">✕ Close</button></div><div class="mb"></div></div>';document.body.append(modal);
let opener,home;const mbody=$('.mb',modal);
function openModal(title,node,html,from){$('#mt').textContent=title;mbody.innerHTML='';if(node){home={node,parent:node.parentNode,next:node.nextSibling};mbody.append(node)}else{mbody.innerHTML=html;$('h3',mbody)?.remove();count(mbody)}
opener=from;modal.hidden=false;document.body.style.overflow='hidden';mbody.scrollTop=0;$('.mx',modal).focus()}
function closeModal(){if(modal.hidden)return;if(home){home.parent.insertBefore(home.node,home.next);home=null}modal.hidden=true;document.body.style.overflow='';$$('.card').forEach(c=>c.setAttribute('aria-expanded','false'));history.replaceState(null,'',location.pathname+location.search);opener&&opener.focus()}
$('.mx',modal).onclick=closeModal;modal.addEventListener('click',e=>{if(e.target==modal)closeModal()});addEventListener('keydown',e=>{if(e.key=='Escape'&&!$('.lb'))closeModal()});
function openCard(id){const c=$('#'+id);if(!c||!c.classList.contains('card'))return false;const d=SECS.find(s=>s.id==c.closest('section').id).cards.find(x=>x.id==id);c.setAttribute('aria-expanded','true');openModal(d.t,null,d.h(),c);history.replaceState(null,'','#'+id);return true}
$$('.card').forEach(c=>c.onclick=()=>openCard(c.id));
/* counters */
const num=s=>{const m=s.match(/[\d,.]+/);return m?[m.index,m[0]]:null};
function count(root){$$('b[data-c]',root).forEach(b=>{const t=b.dataset.c,m=num(t);if(!m||RM)return;const end=parseFloat(m[1].replace(/,/g,'')),dec=m[1].includes('.')?1:0,t0=performance.now();
(function f(n){const p=Math.min(1,(n-t0)/1200),v=end*p;b.textContent=t.slice(0,m[0])+(dec?v.toFixed(1):Math.round(v).toLocaleString('en-IN').replace(/,/g,m[1].includes(',')?',':'')).toString()+t.slice(m[0]+m[1].length);p<1?requestAnimationFrame(f):b.textContent=t})(t0)})}
/* data lists */
function lister(kind,secId,title,eyebrow,desc,strip){const tabs=TABS[kind],data=D[kind],mine=new RegExp(CFG.name,'g');
M.insertAdjacentHTML('beforeend',`<section class="sec rv" id="${secId}"><div class="wrap"><h2>${title}</h2><p class="sub">${desc}</p><div class="strip">${strip.map(([l,f])=>`<div><b>${data.filter(f).length.toLocaleString()}</b>${l}</div>`).join('')}</div><div class="tabs"></div><div class="lw"><div class="tools"><input type="search" aria-label="Search" placeholder="Search"><select aria-label="${kind=='pubs'?'Year':'Sponsor'}"></select></div><div class="list"></div><button class="more">Show more</button></div></div></section>`);
const sec=$('#'+secId),tb=$('.tabs',sec),q=$('input',sec),sel=$('select',sec),ls=$('.list',sec),more=$('.more',sec);let tab=tabs[0][0],lim=15;
const items=()=>data.filter(e=>e.tab==tab);
const rows=()=>{let r=items().filter(e=>(!q.value||e.text.toLowerCase().includes(q.value.toLowerCase()))&&(!sel.value||String(kind=='pubs'?e.year:e.sponsor)==sel.value));return r.sort((a,b)=>(b.year||0)-(a.year||0))};
const ent=e=>{let t=esc(e.text);t=t.replace(mine,m=>`<span class="me">${m}</span>`);const ti=t.match(/[“"]([^”"]{8,})[”"]/);if(ti)t=t.replace(ti[0],`<b>${ti[0]}</b>`);
t=t.replace(/https?:\/\/\S+/g,'').trim();const link=e.doi&&`<a class="btn" href="${e.doi}" target="_blank" rel="noopener noreferrer">${/doi\.org/.test(e.doi)?'DOI':'Link'} ↗</a>`;
return `<article class="ent">${e.year?`<span class="chip">${e.year}</span>`:''}${e.status?`<span class="chip s">${e.status}</span>`:''}${e.amount?`<span class="chip a">${esc(e.amount)}</span>`:''}${e.sub?`<span class="m">${esc(e.sub.split(' (')[0])} · </span>`:''}${kind=='projects'&&e.sponsor[0]!='O'?`<span class="m">${esc(e.sponsor)}${e.period?' · '+esc(e.period):''}<br></span>`:''}${t} ${link||''}</article>`};
const draw=()=>{const r=rows();ls.innerHTML=r.slice(0,lim).map(ent).join('')||'<p>No entries match.</p>';more.hidden=r.length<=lim};
const fill=()=>{const k=kind=='pubs'?'year':'sponsor',v=[...new Set(items().map(e=>e[k]).filter(Boolean))].sort((a,b)=>kind=='pubs'?b-a:String(a).localeCompare(b));sel.innerHTML=`<option value="">All ${kind=='pubs'?'years':'sponsors'}</option>`+v.map(x=>`<option>${x}</option>`).join('')};
const lw=$('.lw',sec),sel_=(k,from)=>{tab=k;lim=15;q.value='';fill();draw();openModal(tabs.find(t=>t[0]==k)[1]+' · '+items().length,lw,'',from||$('#'+secId+'-'+k));history.replaceState(null,'','#'+secId+'-'+k)};
const tabs_=()=>{tb.innerHTML=tabs.map(([k,n])=>`<button id="${secId}-${k}" aria-haspopup="dialog">${n} · ${data.filter(e=>e.tab==k).length}</button>`).join('');$$('button',tb).forEach((b,i)=>b.onclick=()=>sel_(tabs[i][0],b))};
q.oninput=()=>{lim=15;draw()};sel.onchange=()=>{lim=15;draw()};more.onclick=()=>{lim+=15;draw()};fill();tabs_();draw();sec._go=k=>sel_(k)}
lister('pubs','output','Research Output: Publications & Knowledge','Publications','Journal papers, conference papers, books, chapters, technical documents and patents. Counts are computed from the Annex I list.',[['journal papers',e=>e.tab=='intl'],['conference papers',e=>e.tab=='conf'],['books',e=>e.tab=='books'],['all entries',e=>true]]);
lister('projects','projects','Projects','Projects','Research and developmental projects by category.',[['projects',e=>true],['sponsored',e=>e.tab=='spons'],['R&D',e=>e.tab=='rd']]);
M.insertAdjacentHTML('beforeend',`<section class="sec rv" id="contact"><div class="wrap"><h2>Contact</h2><div class="ct"><p><a href="mailto:${CFG.email}">${CFG.email}</a><button data-copy="${CFG.email}">Copy</button></p><p><a href="tel:${CFG.phone}">${CFG.phone}</a><button data-copy="${CFG.phone}">Copy</button></p><div class="links">${CFG.links.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener noreferrer">${l[0]} ↗</a>`).join('')}</div></div></div></section>`);
$$('[data-copy]').forEach(b=>b.onclick=()=>navigator.clipboard.writeText(b.dataset.copy).then(()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1500)}));
$('#yr').textContent=new Date().getFullYear();
/* nav */
$('#nav').innerHTML=NAV.map(([id,t,sub])=>`<li><a class="t" href="#${id}" data-s="${id}"${sub?' aria-haspopup="true" aria-expanded="false"':''}>${t}${sub?'<span class="car-" aria-hidden="true">▼</span>':''}</a>${sub?`<div class="dd"><small>Choose a topic:</small>${sub.map(s=>`<a href="#${s[0]}" data-go="${s[0]}">${s[1]}</a>`).join('')}</div>`:''}</li>`).join('');
function go(id){const m=id.match(/^(output|projects)-(.+)/);if(m){const s=$('#'+m[1]);s._go(m[2]);return}if(openCard(id))return;$('#'+id)?.scrollIntoView()}
const closeNav=()=>{$$('#nav li.open').forEach(l=>{l.classList.remove('open');$('a.t',l).setAttribute('aria-expanded','false')})};
$$('#nav a.t[aria-haspopup]').forEach(a=>a.onclick=e=>{e.preventDefault();const li=a.closest('li'),was=li.classList.contains('open');closeNav();if(!was){li.classList.add('open');a.setAttribute('aria-expanded','true');if(innerWidth>900)$('#'+a.dataset.s).scrollIntoView()}});
$$('#nav a.t:not([aria-haspopup])').forEach(a=>a.addEventListener('click',()=>{closeNav();nav.classList.remove('show');mb.setAttribute('aria-expanded','false')}));
$$('[data-go]').forEach(a=>a.onclick=e=>{e.preventDefault();closeNav();nav.classList.remove('show');mb.setAttribute('aria-expanded','false');go(a.dataset.go)});
const nav=$('#nav'),mb=$('#menuBtn');mb.onclick=()=>{const s=nav.classList.toggle('show');mb.setAttribute('aria-expanded',s)};
document.addEventListener('click',e=>{if(!e.target.closest('nav.main'))closeNav()});addEventListener('keydown',e=>{if(e.key=='Escape')closeNav()});
addEventListener('load',()=>{if(location.hash.length>1)go(location.hash.slice(1))});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08});$$('.rv').forEach(e=>io.observe(e));
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('a.t').forEach(a=>a.classList.toggle('on',a.dataset.s==e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});$$('main section').forEach(s=>spy.observe(s));
/* lightbox */
document.addEventListener('click',e=>{if(e.target.matches('.gal img')){const l=document.createElement('div');l.className='lb';l.setAttribute('role','dialog');l.setAttribute('aria-label','Image');l.innerHTML=`<img src="${e.target.src}" alt="${esc(e.target.alt)}">`;l.onclick=()=>l.remove();document.body.append(l);const k=ev=>{if(ev.key=='Escape'){l.remove();removeEventListener('keydown',k)}};addEventListener('keydown',k)}});
