
var O=['primary','bg','surface','surface-raised','border','text-primary','text-secondary','text-muted','on-primary','secondary','tertiary','success','warning','danger','info','hover','active','selected','focus','disabled'];
var P={},W={},cur='#7B5CF0';
function $(i){return document.getElementById(i)}
function rgb(h){h=h.replace('#','');return[0,2,4].map(function(i){return parseInt(h.substr(i,2),16)})}
function hex(r,g,b){return'#'+[r,g,b].map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return(v<16?'0':'')+v.toString(16)}).join('').toUpperCase()}
function hsl(x){var c=rgb(x).map(function(v){return v/255}),r=c[0],g=c[1],b=c[2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,s=0,h=0,d=mx-mn;if(d){s=d/(1-Math.abs(2*l-1));h=mx==r?((g-b)/d)%6:mx==g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360}return{h:h,s:s*100,l:l*100}}
function fh(h,s,l){h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s))/100;l=Math.max(0,Math.min(100,l))/100;var c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2,r=0,g=0,b=0;if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}return hex((r+m)*255,(g+m)*255,(b+m)*255)}
function lum(x){var c=rgb(x).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function cr(a,b){var x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function hd(a,b){var d=Math.abs(a-b)%360;return d>180?360-d:d}
function f(n){return n.toFixed(1)}
function layers(){return[P.bg,P.surface,P['surface-raised']].filter(Boolean)}
function minCr(c){return Math.min.apply(null,layers().map(function(x){return cr(c,x)}))}
function next(){for(var i=0;i<O.length;i++)if(!P[O[i]])return O[i];return null}
function checkWeb(role,c){var q=hsl(c),p=P.primary?hsl(P.primary):null,e=null,w=[],bg=P.bg,sf=P.surface,rs=P['surface-raised'];
function loud(){if(P.primary&&lum(c)>lum(P.primary)+.12)w.push('Louder than the primary. The lead color should be the brightest brand color.')}
function clash(){['success','warning','danger','info'].forEach(function(k){if(!e&&P[k]&&hd(q.h,hsl(P[k]).h)<25)e='Hue is within 25° of your '+k+' color ('+Math.round(hd(q.h,hsl(P[k]).h))+'° apart), so it would read as a status color. Move this one or re-add '+k+'.'})}
function zone(){var h=q.h,z=h>=90&&h<=170?'green (success)':h>=25&&h<=60?'amber (warning)':h>=190&&h<=235?'blue (info)':(h>=345||h<=15)?'red (danger)':null;if(z&&!(P.success&&P.warning&&P.danger&&P.info))w.push('Hue sits in the '+z+' zone, so that status color will have to stay 25° away from it.')}
function sem(a,b,name){var inr=a<=b?(q.h>=a&&q.h<=b):(q.h>=a||q.h<=b);if(!inr)e=name+' must look like '+name+' (hue '+a+'–'+b+'). Yours is '+Math.round(q.h)+'.';else if(bg&&cr(c,bg)<3)e='Only '+f(cr(c,bg))+':1 on the background. Needs 3:1. Make it lighter.';else{['primary','secondary','tertiary'].forEach(function(k){if(!e&&P[k]&&hd(q.h,hsl(P[k]).h)<25)e='Too close in hue to your '+k+' ('+Math.round(hd(q.h,hsl(P[k]).h))+'° apart). Users would mistake this status color for a brand color. Move the '+k+' or shift this color within its range.'})}}
function st(){if(P['on-primary']&&cr(c,P['on-primary'])<4.5)e='On-primary text drops to '+f(cr(c,P['on-primary']))+':1 on this color. Needs 4.5:1.';var d=Math.abs(q.l-p.l);if(!e&&hd(q.h,p.h)>15)e='Keep the same hue as the primary (within 15°).';else if(!e&&(d<3||d>(role=='hover'?15:25)))e='Lightness should differ from the primary by 3–'+(role=='hover'?15:25)+' points. Now '+f(d)+'.';else if(!e&&role=='active'&&P.hover&&Math.abs(q.l-hsl(P.hover).l)<3)e='Active must be a clear step from hover (3+ points).'}
switch(role){
case'primary':if(q.s<35)e='Too gray for a lead color. Raise saturation to at least 35%.';else if(q.l<35||q.l>80)e='Lightness must be 35–80% to stay visible on dark neutrals.';else if(bg&&cr(c,bg)<3)e='Only '+f(cr(c,bg))+':1 on your background. Needs 3:1.';break;
case'bg':if(q.l>12)e='Background must be very dark (lightness 12% or less). Yours is '+f(q.l)+'%.';else if(q.s>35)e='Too saturated for a neutral. Keep saturation at 35% or less.';else if(cr(P.primary,c)<3)e='Your primary is only '+f(cr(P.primary,c))+':1 on this background. Needs 3:1. Darken the background or re-add a lighter primary.';else if(hd(q.h,p.h)>40)w.push('Hue is far from the primary, so the palette may feel unrelated.');break;
case'surface':case'surface-raised':var base=hsl(role=='surface'?bg:sf).l,d=q.l-base;if(d<2||d>10)e='Must be 2–10 points lighter than the layer below. Yours is '+f(d)+'.';else if(q.s>35)e='Too saturated for a neutral. Keep it at 35% or less.';break;
case'border':var d2=q.l-hsl(sf).l;if(d2<2||d2>16)e='Border should be 2–16 points lighter than the surface. Yours is '+f(d2)+'.';break;
case'text-primary':if(q.l<85)e='Main text should be near-white (lightness 85%+).';else if(minCr(c)<4.5)e='Only '+f(minCr(c))+':1 on your weakest layer. Needs 4.5:1.';else if(c=='#FFFFFF')w.push('Pure white glares on dark. A slightly softer white is easier on the eyes.');break;
case'text-secondary':case'text-muted':var up=role=='text-secondary'?P['text-primary']:P['text-secondary'];if(minCr(c)<4.5)e='Only '+f(minCr(c))+':1 on your weakest layer. Needs 4.5:1.';else if(lum(c)>=lum(up))e='Must be dimmer than '+(role=='text-secondary'?'main':'secondary')+' text.';break;
case'on-primary':if(cr(c,P.primary)<4.5)e='Only '+f(cr(c,P.primary))+':1 on the primary. Needs 4.5:1. Try your background color or near-white.';break;
case'secondary':if(hd(q.h,p.h)<25)e='Hue is too close to the primary ('+Math.round(hd(q.h,p.h))+'° apart). Needs 25°+.';else if(q.s<30)e='Too gray ('+Math.round(q.s)+'% saturation). A second accent needs at least 30% or it reads as a neutral.';else if(cr(c,bg)<3)e='Only '+f(cr(c,bg))+':1 on the background. Needs 3:1.';else{clash();if(!e){loud();zone();var gap=hd(q.h,p.h);if(gap<50)w.push('Only '+Math.round(gap)+'° from the primary, so there is no room for a tertiary between them. The tertiary will have to sit on the far side of the wheel.')}}break;
case'tertiary':if(hd(q.h,p.h)<25||hd(q.h,hsl(P.secondary).h)<25)e='Hue must be 25°+ from both the primary and the secondary.';else if(q.s<20)e='Too gray ('+Math.round(q.s)+'% saturation). Even a quiet tertiary needs at least 20%.';else if(cr(c,bg)<3)e='Only '+f(cr(c,bg))+':1 on the background. Needs 3:1.';else{clash();if(!e){loud();if(q.s>p.s+15)w.push('More vivid than the primary. Tertiary should be quiet.');zone()}}break;
case'success':sem(90,170,'green');break;case'warning':sem(25,60,'amber');break;case'info':sem(190,235,'blue');break;
case'danger':sem(345,15,'red');if(!e&&hd(q.h,p.h)<30)e='Too close to your primary ('+Math.round(hd(q.h,p.h))+'°). Users would confuse errors with the main action.';break;
case'hover':case'active':st();break;
case'selected':if(hd(q.h,p.h)>20&&hd(q.h,hsl(P.secondary).h)>20)e='Selected should use the hue of your primary or secondary (within 20°).';break;
case'focus':if(cr(c,bg)<3)e='Focus ring must be visible: only '+f(cr(c,bg))+':1 on the background. Needs 3:1.';break;
case'disabled':var k=cr(c,sf);if(q.s>25)e='Disabled should be nearly gray (saturation 25% or less).';else if(k>=3||k<1.3)e='Disabled should be dim but present: '+f(k)+':1 on the surface. Aim for 1.3–3.';break}
return{e:e,w:w}}
function suggWeb(role){var p=hsl(P.primary||cur),b=P.bg?hsl(P.bg):{l:8},s=P.surface?hsl(P.surface):{l:13};
var lightText=P['on-primary']?lum(P['on-primary'])>lum(P.primary):true,dir=lightText?-1:1;
var m={primary:cur,bg:fh(p.h,20,8),surface:fh(p.h,18,13),'surface-raised':fh(p.h,17,18),border:fh(p.h,18,24),'text-primary':fh(p.h,15,92),'text-secondary':fh(p.h,10,72),'text-muted':fh(p.h,8,60),
'on-primary':P.bg&&P['text-primary']?(cr(P.bg,P.primary)>=cr(P['text-primary'],P.primary)?P.bg:P['text-primary']):'#FFFFFF',
secondary:fh(p.h+40,p.s*.8,p.l),tertiary:fh(p.h-40,p.s*.6,p.l),success:fh(150,55,55),warning:fh(40,90,55),danger:fh(2,80,62),info:fh(205,70,60),
hover:fh(p.h,p.s,p.l+dir*6),active:fh(p.h,p.s,p.l+dir*12),selected:P.primary,focus:fh(p.h,p.s,Math.min(85,p.l+15)),disabled:fh(p.h,8,s.l+16)};
return m[role]}
function setC(c,skip){c=c.toUpperCase();cur=c;$('hx').value=c;$('cp').value=c.toLowerCase();$('pv').style.background=c;var q=hsl(c);
if(!skip){$('h').value=Math.round(q.h);$('s').value=Math.round(q.s);$('l').value=Math.round(q.l)}
$('hv').textContent=$('h').value;$('sv').textContent=$('s').value+'%';$('lv').textContent=$('l').value+'%'}
function say(t,k){var m=$('msg');m.style.display='block';m.style.color=k=='e'?'var(--bad)':k=='w'?'var(--warn)':'var(--ok)';m.textContent=t}
function toast(t){var x=$('toast');x.textContent=t;x.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(function(){x.style.display='none'},1400)}
function copy(t){function fb(){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(a)}
try{navigator.clipboard.writeText(t).catch(fb)}catch(e){fb()}toast('Copied '+(t.length>9?'CSS':t))}
function opts(){var n=next(),s=$('role'),v=s.value;s.innerHTML='';O.forEach(function(r){var o=document.createElement('option');o.value=r;o.textContent=r;if(!P[r]&&r!=n)o.disabled=true;s.appendChild(o)});s.value=(v&&(P[v]||v==n))?v:n;if(!n&&!P[s.value])s.value=O[0]}
function renderWeb(){var n=next();opts();if(n&&$('role').value!=n&&!P[$('role').value])$('role').value=n;
$('chips').innerHTML=O.map(function(r){return'<span class="chip '+(P[r]?'d':r==n?'c':'')+'">'+(P[r]?'✓ ':'')+r+'</span>'}).join('');
$('sws').innerHTML=O.filter(function(r){return P[r]}).map(function(r){var c=P[r],t=lum(c)>.35?'#131018':'#eae8ee';return'<div class="sw" data-c="'+c+'" style="background:'+c+';color:'+t+'"><b>'+r+'</b>'+c+'</div>'}).join('')||'<span class="mu">Nothing yet.</span>';
document.querySelectorAll('.sw').forEach(function(e){e.onclick=function(){copy(e.dataset.c)}});
var css=':root {\n'+O.map(function(r){return P[r]?'  --'+r+': '+(r=='selected'?'color-mix(in srgb, '+P[r]+' 15%, transparent)':P[r])+';':'  /* --'+r+': not added yet */'}).join('\n')+'\n}';$('css').textContent=css;
var wc=0,all=[];O.forEach(function(r){(W[r]||[]).forEach(function(x){wc++;all.push(r+': '+x)})});
var done=O.filter(function(r){return P[r]}).length,sc=Math.max(0,100-6*wc),h='<div style="font-size:14px" class="mu">Progress '+done+'/20 · soft warnings '+wc+'</div><div style="font-size:30px;font-weight:500;margin:4px 0">'+sc+'<span class="mu" style="font-size:16px">/100 so far</span></div>';
if(!n){var q=hsl(P.primary),s2=hsl(P.secondary),t2=hsl(P.tertiary),ex=[];
if(s2.s>=q.s&&t2.s>=q.s)ex.push('Primary, secondary, and tertiary are all equally vivid. They will compete. Mute one.');
var dh=hd(q.h,s2.h);var rel=dh>=150?'complementary (opposite), a strong pairing in small doses':dh<=60?'analogous (neighbors), calm and cohesive':'a split relationship, fine if the accents stay small';
sc=Math.max(0,100-6*(wc+ex.length));var g=sc>=92?'A':sc>=80?'B':sc>=65?'C':'D';
var lo=Math.min(minCr(P['text-primary']),minCr(P['text-secondary']),minCr(P['text-muted']));
h='<div style="font-size:14px" class="mu">Final grade</div><div style="font-size:34px;font-weight:500">'+g+' · '+sc+'/100</div><ul style="padding-left:18px"><li style="color:var(--ok)">Lowest text contrast: '+f(lo)+':1 across all layers.</li><li style="color:var(--ok)">Neutrals step cleanly and semantic colors are in the right ranges.</li><li>Primary and secondary are '+rel+'.</li>'+all.concat(ex).map(function(x){return'<li style="color:var(--warn)">'+x+'</li>'}).join('')+'</ul>'}
else if(all.length)h+='<ul style="padding-left:18px;font-size:14px">'+all.map(function(x){return'<li style="color:var(--warn)">'+x+'</li>'}).join('')+'</ul>';
$('score').innerHTML=h}
$('hx').oninput=function(){if(/^#[0-9a-f]{6}$/i.test(this.value))setC(this.value)};
$('cp').oninput=function(){setC(this.value)};
['h','s','l'].forEach(function(i){$(i).oninput=function(){setC(fh(+$('h').value,+$('s').value,+$('l').value),true)}});
$('sug').onclick=function(){var r=$('role').value;if(mode=='web'&&r!='primary'&&!P.primary){say('Add a primary first.','e');return}var v=sugg(r);if(!v){say('No suggestion yet.','e');return}setC(v);say('Suggested a starting value for '+r+'. Adjust it, then press Add.','w')};
$('add').onclick=function(){var r=$('role').value,n=next();if(!P[r]&&r!=n){say('Finish '+n+' first.','e');return}
var res=check(r,cur);if(res.e){say('Blocked. '+res.e,'e');return}
P[r]=cur;W[r]=res.w;render();var nn=next();if(nn)$('role').value=nn;
say(res.w.length?'Added '+r+', with a warning: '+res.w[0]:'Added '+r+'.'+(nn?' Next: '+nn+'.':' Palette complete. See your score below.'),res.w.length?'w':'o')};
$('clr').onclick=function(){P={};W={};$('msg').style.display='none';setC('#7B5CF0');render();toast('Palette cleared')};
$('cc').onclick=function(){copy($('css').textContent)};
setC('#7B5CF0');var OR=['accent','bg','fg','cursor','selection-bg','black','red','green','yellow','blue','magenta','cyan','white','bright-black','bright-red','bright-green','bright-yellow','bright-blue','bright-magenta','bright-cyan','bright-white'];
var M={web:{O:O,P:P,W:W},rice:{O:OR,P:{},W:{}}},mode='web';
var AN=['black','red','green','yellow','blue','magenta','cyan','white'];
var HR={red:[345,15],green:[90,160],yellow:[40,65],blue:[205,250],magenta:[280,330],cyan:[165,200]};
var DD={bg:'#101218',fg:'#E8E8EE',accent:'#5C72F0',cursor:'#5C72F0','selection-bg':'#262836',black:'#1B1D27',red:'#EC5651',green:'#40BA40',yellow:'#F0AA28',blue:'#5C72F0',magenta:'#C56BE1',cyan:'#2898AF',white:'#B0B3BF','bright-black':'#6B6F80','bright-white':'#FFFFFF'};
function inr(h,a,b){return a<=b?(h>=a&&h<=b):(h>=a||h<=b)}
function C(r){return P[r]||DD[r]||(r.indexOf('bright-')==0?C(r.slice(7)):'#888888')}
function check(role,c){return mode=='web'?checkWeb(role,c):checkRice(role,c)}
function sugg(role){return mode=='web'?suggWeb(role):suggRice(role)}
function render(){if(mode=='web')renderWeb();else renderRice()}
function checkRice(role,c){var q=hsl(c),e=null,w=[],bg=P.bg,fg=P.fg,base=role.replace('bright-',''),br=base!=role;
if(role=='accent'){if(q.s<35)e='Too gray for an accent. Raise saturation to at least 35%.';else if(bg&&cr(c,bg)<3)e='Only '+f(cr(c,bg))+':1 on the background. Needs 3:1.'}
else if(role=='bg'){if(q.l>15)e='Terminal background must be dark (lightness 15% or less).';else if(q.s>40)e='Too saturated for a background (40% max).';else if(P.accent&&cr(P.accent,c)<3)e='Your accent is only '+f(cr(P.accent,c))+':1 on this. Needs 3:1.';else if(P.accent&&hd(q.h,hsl(P.accent).h)>40)w.push('Hue is far from the accent, so the setup may feel unrelated.')}
else if(role=='fg'){if(cr(c,bg)<7)e='Only '+f(cr(c,bg))+':1 on the background. Terminal text needs 7:1.'}
else if(role=='cursor'){if(cr(c,bg)<3)e='Cursor must be visible: only '+f(cr(c,bg))+':1. Needs 3:1.'}
else if(role=='selection-bg'){var d=q.l-hsl(bg).l;if(d<6||d>25)e='Selection should be 6\u201325 points lighter than the background. Yours is '+f(d)+'.';else if(cr(fg,c)<4.5)e='Text on the selection drops to '+f(cr(fg,c))+':1. Needs 4.5:1. Make the selection darker.'}
else if(role=='black'){if(q.l<3||q.l>25)e='Black should be dark (lightness 3\u201325%).';else if(q.s>40)e='Too saturated for black (40% max).'}
else if(role=='bright-black'){if(q.s>40)e='Too saturated for gray (40% max).';else if(q.l-hsl(P.black).l<8)e='Must be at least 8 points lighter than black.';else if(cr(c,bg)<3)e='Comments in this color would be hard to read: '+f(cr(c,bg))+':1. Needs 3:1.'}
else if(role=='white'){if(q.l<70)e='White should be light (lightness 70%+).';else if(q.s>30)e='Too colorful for white (30% max).';else if(cr(c,bg)<4.5)e='Only '+f(cr(c,bg))+':1. Needs 4.5:1.'}
else if(role=='bright-white'){if(q.l<hsl(P.white).l+2)e='Must be lighter than white.';else if(cr(c,bg)<7)e='Only '+f(cr(c,bg))+':1. Needs 7:1.'}
else{var r=HR[base];
if(!inr(q.h,r[0],r[1]))e=base+' must look like '+base+' (hue '+r[0]+'\u2013'+r[1]+'). Yours is '+Math.round(q.h)+'.';
else if(q.s<30)e='Too gray (30% saturation minimum).';
else if(cr(c,bg)<4.5)e='Only '+f(cr(c,bg))+':1 on the background. Terminal text needs 4.5:1.';
else if(br){var n0=hsl(P[base]);if(hd(q.h,n0.h)>15)e='Keep the same hue as normal '+base+' (within 15\u00b0).';else if(q.l-n0.l<5)e='Must be at least 5 points lighter than normal '+base+'.'}
if(!e&&q.s>90)w.push('Very saturated. Colors this vivid can vibrate on dark backgrounds.')}
return{e:e,w:w}}
function suggRice(role){var a=P.accent?hsl(P.accent):hsl(cur),h=a.h;
var m={accent:cur,bg:fh(h,20,8),fg:fh(h,15,88),cursor:P.accent||cur,'selection-bg':fh(h,20,20),black:fh(h,18,16),red:fh(2,65,62),green:fh(125,45,58),yellow:fh(48,75,62),blue:fh(222,70,66),magenta:fh(300,50,66),cyan:fh(182,55,58),white:fh(h,12,80),'bright-black':fh(h,10,44),'bright-white':fh(h,10,94)};
if(m[role])return m[role];var bs=P[role.replace('bright-','')];if(!bs)return null;var b=hsl(bs);return fh(b.h,Math.min(100,b.s+5),Math.min(88,b.l+10))}
function renderRice(){var n=next();opts();
$('chips').innerHTML=O.map(function(r){return'<span class="chip '+(P[r]?'d':r==n?'c':'')+'">'+(P[r]?'\u2713 ':'')+r+'</span>'}).join('');
$('sws').innerHTML=O.filter(function(r){return P[r]}).map(function(r){var c=P[r],t=lum(c)>.35?'#131018':'#eae8ee';return'<div class="sw" data-c="'+c+'" style="background:'+c+';color:'+t+'"><b>'+r+'</b>'+c+'</div>'}).join('')||'<span class="mu">Nothing yet.</span>';
document.querySelectorAll('.sw').forEach(function(e){e.onclick=function(){copy(e.dataset.c)}});
var L=['# paste into kitty.conf'];function ln(k,r){L.push(P[r]?k+' '+P[r]:'# '+k+' (not added yet)')}
ln('active_border_color','accent');ln('background','bg');ln('foreground','fg');ln('cursor','cursor');ln('selection_background','selection-bg');
AN.forEach(function(r,i){ln('color'+i,r)});AN.forEach(function(r,i){ln('color'+(i+8),'bright-'+r)});
$('css').textContent=L.join('\n');
function s(r,t){return `<span style='color:${C(r)}'>${t}</span>`}
function blk(r){return `<span style='display:inline-block;width:28px;height:18px;background:${C(r)}'></span>`}
$('term').innerHTML=`<div style='background:${C('bg')};color:${C('fg')};border:2px solid ${C('accent')};border-radius:8px;padding:14px;font:13px/1.55 ui-monospace,Menlo,Consolas,monospace;overflow-x:auto;white-space:pre'>${s('accent','~/nexus')} ${s('green','\u276f')} git status
On branch ${s('blue','main')}
${s('green','  new file:   src/main.rs')}
${s('red','  deleted:    old.py')}
${s('yellow','warning:')} unused variable ${s('bright-black','// see line 12')}
${s('magenta','fn')} ${s('blue','main')}() { ${s('cyan','println!')}(${s('green','"hi"')}); }
<span style='background:${C('selection-bg')}'>selected text looks like this</span>
${s('accent','~/nexus')} ${s('green','\u276f')} <span style='background:${C('cursor')};color:${C('bg')}'> </span>

${AN.map(blk).join('')}
${AN.map(function(r){return blk('bright-'+r)}).join('')}</div>`;
var wc=0,all=[];O.forEach(function(r){(W[r]||[]).forEach(function(x){wc++;all.push(r+': '+x)})});
var done=O.filter(function(r){return P[r]}).length,sc=Math.max(0,100-6*wc),h='<div style="font-size:14px" class="mu">Progress '+done+'/21 \u00b7 soft warnings '+wc+'</div><div style="font-size:30px;font-weight:500;margin:4px 0">'+sc+'<span class="mu" style="font-size:16px">/100 so far</span></div>';
if(!n){var lo=99;['red','green','yellow','blue','magenta','cyan'].forEach(function(r){lo=Math.min(lo,cr(P[r],P.bg),cr(P['bright-'+r],P.bg))});var g=sc>=92?'A':sc>=80?'B':sc>=65?'C':'D';
h='<div style="font-size:14px" class="mu">Final grade</div><div style="font-size:34px;font-weight:500">'+g+' \u00b7 '+sc+'/100</div><ul style="padding-left:18px"><li style="color:var(--ok)">Lowest ANSI color contrast: '+f(lo)+':1 on the background.</li><li style="color:var(--ok)">All six hues are recognizable and every bright color has a matching normal color.</li><li style="color:var(--ok)">Selection, cursor, and text are readable together.</li>'+all.map(function(x){return'<li style="color:var(--warn)">'+x+'</li>'}).join('')+'</ul>'}
else if(all.length)h+='<ul style="padding-left:18px;font-size:14px">'+all.map(function(x){return'<li style="color:var(--warn)">'+x+'</li>'}).join('')+'</ul>';
$('score').innerHTML=h}
function swm(m){if(m==mode)return;M[mode].P=P;M[mode].W=W;mode=m;O=M[m].O;P=M[m].P;W=M[m].W;$('tw').className=m=='web'?'p':'';$('tr').className=m=='rice'?'p':'';$('pvw').style.display=m=='rice'?'block':'none';$('h5').textContent=m=='rice'?'5. Config (kitty)':'5. CSS';$('cc').textContent=m=='rice'?'Copy config':'Copy all CSS';$('msg').style.display='none';$('role').value='';render()}
$('tw').onclick=function(){swm('web')};$('tr').onclick=function(){swm('rice')};
render();
