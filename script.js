(()=>{"use strict";
const $=s=>document.querySelector(s),R=1300,P=820,root=document.documentElement,body=document.body;
const cards=[...document.querySelectorAll("#hud article")],N=cards.length;
const logo=window.AM_LOGO_DATA||"",mark=$("#mark");
if(logo)mark.src=logo;else mark.remove();
const small=matchMedia("(max-width:760px)"),calm=matchMedia("(prefers-reduced-motion:reduce)");
const COL=cards.map(c=>c.dataset.c),names=cards.map(c=>c.dataset.n);
cards.forEach((c,i)=>c.style.setProperty("--ar",COL[i]));

/* منو و نقطه‌ها */
const mlist=$("#mlist"),dots=$("#dots"),mbtn=$("#mbtn");
mlist.innerHTML=names.map((n,i)=>`<a href="#r${i}" data-go="${i}" style="--ar:${COL[i]};--n:${i}"><i></i>${n}</a>`).join("");
dots.innerHTML=names.map((n,i)=>`<button type="button" data-go="${i}" aria-label="${n}" title="${n}" style="--ar:${COL[i]}"></button>`).join("");
const setMenu=o=>{body.classList.toggle("open",o);mbtn.setAttribute("aria-expanded",o);$("#menu").setAttribute("aria-hidden",!o)};
mbtn.onclick=()=>setMenu(!body.classList.contains("open"));
$("#scrim").onclick=()=>setMenu(false);

const ok=!calm.matches&&window.CSS&&CSS.supports("transform-style","preserve-3d");
const seg=()=>innerHeight*1.1;
const go=i=>ok?scrollTo({top:i*seg(),behavior:"smooth"}):cards[i].scrollIntoView({behavior:"smooth"});
document.addEventListener("click",e=>{const a=e.target.closest("[data-go]");if(!a)return;e.preventDefault();setMenu(false);go(+a.dataset.go)});
addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
if(!ok)return;

/* ساخت اتاق‌ها */
const L=small.matches?6:10;
let lg="";
for(let i=0;i<L;i++)lg+=`<img src="${logo}" alt="" style="transform:translateZ(${(i-L/2)*(small.matches?4:5)}px);filter:brightness(${(.5+.5*i/(L-1)).toFixed(2)})">`;
const pr=(x,y,z,h,s=1)=>`<div class="pr" style="transform:translate3d(${x}px,${y}px,${z}px) scale(${s})">${h}</div>`;
const bub=(t,x,y,z,u)=>pr(x,y,z,`<i class="b${u?" u":""}">${t}</i>`);
const fr=(a,b,x,y,z,r)=>pr(x,y,z,`<i class="fr" style="--s1:${a};--s2:${b};transform:rotateY(${r}deg)"></i>`);
const cube=(x,y,z,s,c)=>pr(x,y,z,`<div class="cb" style="--ar:${c}"><i></i><i></i><i></i><i></i><i></i><i></i></div>`,s);
const who=["خوش‌بین","منطقی","رفیق","بدبین","ده سال بعد"];
const props=[
  pr(0,-20,-720,`<div class="lg">${lg}</div>`),
  bub("یه ایمیل رسمی برام بنویس",-230,-120,-560,1)+bub("حتماً! لحنش رسمی باشه یا گرم؟",-10,-20,-700)+bub("گرم، ولی کوتاه",-200,90,-850,1)+bub("آماده‌ست. فارسی‌ترش کنم؟",30,190,-980),
  pr(-40,0,-780,[0,1,2,3].map(i=>`<i class="rg" style="transform:translateZ(${-i*80}px);animation-delay:${-i*.5}s"></i>`).join("")+`<i class="orb"></i>`),
  fr("#2b3c8f","#2de2c8",-280,-30,-640,22)+fr("#7a2d6f","#ffc857",-60,-80,-820,0)+fr("#0f766e","#ffde8a",150,30,-700,-22),
  pr(-40,40,-760,`<i class="tb"></i><div class="ct">${who.map((w,i)=>`<i class="st" style="transform:rotateY(${i*72}deg) translateZ(210px)">${w}</i>`).join("")}</div>`),
  cube(-250,-60,-620,1,"255,75,228")+cube(-20,60,-800,1.4,"45,226,200")+cube(190,-70,-700,.8,"255,200,87"),
  pr(-30,10,-760,`<i class="bw"></i><i class="ph"></i><i class="cu"></i>`),
  pr(0,-10,-700,`<div class="lg" style="animation-duration:7s">${lg}</div>`,1.15)
];
const world=$("#world");
world.innerHTML=props.map((p,i)=>`<div class="rm" style="--ar:${COL[i]};transform:translateZ(${-i*R}px)"><i class="fl"></i><i class="ce"></i><i class="wl"></i><i class="wr"></i><i class="ar"></i>${p}</div>`).join("");
const rooms=[...world.children],links=[...mlist.children],dbtn=[...dots.children],bar=$("#bar i"),sp=$("#spacer");
root.classList.add("d3");

/* دوربین: اسکرول ← پرواز در طول راهرو، با مکث در مرکز هر اتاق */
let cur=0,tgt=0,mx=0,my=0,rx=0,ry=0,raf=0,act=-1;
const target=()=>{const t=Math.max(0,Math.min(N-1,scrollY/seg())),i=Math.floor(t),f=t-i;return i>=N-1?N-1:i+f*f*f*(f*(6*f-15)+10)};
function frame(){
  cur+=(tgt-cur)*.085;rx+=(mx-rx)*.06;ry+=(my-ry)*.06;
  const s=small.matches?.62:1,ox=small.matches?0:-150,oy=small.matches?-110:10;
  world.style.transform=`translate3d(${ox}px,${oy}px,0) rotateX(${-ry*1.6}deg) rotateY(${rx*2.4}deg) scale3d(${s},${s},${s}) translateZ(${P+220+cur*R}px)`;
  const a=Math.round(Math.max(0,Math.min(N-1,cur)));
  if(a!==act){
    act=a;root.style.setProperty("--ar",COL[a]);
    rooms.forEach((r,i)=>r.style.visibility=Math.abs(i-a)<3?"visible":"hidden");
    links.forEach((l,i)=>l.classList.toggle("on",i===a));
    dbtn.forEach((d,i)=>d.classList.toggle("on",i===a));
  }
  cards.forEach((el,i)=>{
    const o=Math.max(0,Math.min(1,1.25-Math.abs(i-cur)*2.4));
    el.style.opacity=o.toFixed(3);
    el.style.visibility=o>.01?"visible":"hidden";
    el.style.pointerEvents=o>.7?"auto":"none";
    el.style.transform=`translate3d(${(cur-i)*70}px,0,0)`;
  });
  bar.style.transform=`scaleX(${Math.max(0,cur)/(N-1)})`;
  raf=(Math.abs(tgt-cur)>.0005||Math.abs(mx-rx)>.001||Math.abs(my-ry)>.001)?requestAnimationFrame(frame):0;
}
const kick=()=>{raf||(raf=requestAnimationFrame(frame))};
const size=()=>{sp.style.height=(seg()*(N-1)+innerHeight)+"px";tgt=target();kick()};
addEventListener("scroll",()=>{tgt=target();kick()},{passive:true});
addEventListener("resize",size);
addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;kick()},{passive:true});
addEventListener("keydown",e=>{const c=Math.round(cur);if(e.key==="ArrowLeft")go(Math.min(N-1,c+1));else if(e.key==="ArrowRight")go(Math.max(0,c-1))});
tgt=target();cur=tgt-1.2;   /* ورود: دوربین از بیرونِ در به‌سمت اتاق اول پرواز می‌کند */
size();
})();
