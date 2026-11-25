/* LOCALPLAN © 2026 project team. All rights reserved. */
// CAD camera only; never changes physical equipment coordinates.
let cadPan=null,cadSpace=false,cadHand=false;
const cadSVG=$('scene');
function cadPoint(e){let p=cadSVG.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(cadSVG.getScreenCTM().inverse())}
function cadScale(){const m=cadSVG.getScreenCTM();return Math.hypot(m.a,m.b)||1}
function cadZoom(next,e){let old=zoom;next=Math.max(.3,Math.min(8,next));if(e){let p=cadPoint(e);cadOffset.x+=(p.x-600)*(old/next-1);cadOffset.y+=(p.y-380)*(old/next-1)}zoom=next;renderScene();$('zoomreset').textContent=Math.round(zoom*100)+'%'}
function cadFit(){cadOffset.x=0;cadOffset.y=0;zoom=1;let pr=view==='plan'?projectPlan:projectIso;let points=[[0,0],[s.W,0],[s.W,s.D],[0,s.D]].map(v=>pr(...v));if(view==='iso')for(let u of s.units)points.push(projectIso(u.x,u.z,u.h+(u.baseY||0)));let xs=points.map(v=>v[0]),ys=points.map(v=>v[1]);let a=Math.min(...xs),b=Math.max(...xs),c=Math.min(...ys),d=Math.max(...ys);cadOffset.x=600-(a+b)/2;cadOffset.y=380-(c+d)/2;zoom=Math.min(1.4,960/Math.max(1,b-a),550/Math.max(1,d-c));renderScene();$('zoomreset').textContent=Math.round(zoom*100)+'%'}
function cadTarget(e){if(view==='plan')return e.target.closest('[data-unit]');return pickModel(e)}
cadSVG.addEventListener('pointerdown',e=>{if(view==='3d')return;let pan=e.button===1||e.button===2||cadSpace||cadHand||(e.button===0&&(!cadTarget(e)||SIM.active));if(!pan)return;e.preventDefault();e.stopImmediatePropagation();cadPan={id:e.pointerId,x:e.clientX,y:e.clientY,ox:cadOffset.x,oy:cadOffset.y,scale:cadScale()};cadSVG.setPointerCapture(e.pointerId);cadSVG.style.cursor='grabbing'},true);
cadSVG.addEventListener('pointermove',e=>{if(!cadPan||e.pointerId!==cadPan.id)return;e.stopImmediatePropagation();cadOffset.x=cadPan.ox+(e.clientX-cadPan.x)/cadPan.scale;cadOffset.y=cadPan.oy+(e.clientY-cadPan.y)/cadPan.scale;renderScene()},true);
for(let ev of ['pointerup','pointercancel','lostpointercapture'])cadSVG.addEventListener(ev,e=>{if(!cadPan||e.pointerId!==cadPan.id)return;e.stopImmediatePropagation();cadPan=null;cadSVG.style.cursor=cadHand||cadSpace?'grab':''},true);
cadSVG.addEventListener('contextmenu',e=>{if(view!=='3d')e.preventDefault()});
cadSVG.addEventListener('wheel',e=>{if(view==='3d')return;e.preventDefault();e.stopImmediatePropagation();cadZoom(zoom*Math.exp(-Math.max(-180,Math.min(180,e.deltaY))*.0025),e)},{capture:true,passive:false});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName)&&view!=='3d'){e.preventDefault();cadSpace=true;cadSVG.style.cursor='grab'}});document.addEventListener('keyup',e=>{if(e.code==='Space'){cadSpace=false;if(!cadPan)cadSVG.style.cursor=cadHand?'grab':''}});window.addEventListener('blur',()=>{cadSpace=false;cadPan=null;cadSVG.style.cursor=''});
const cadOut=$('zoomout').onclick,cadIn=$('zoomin').onclick,cadReset=$('zoomreset').onclick;
$('zoomout').onclick=()=>view==='3d'?cadOut():cadZoom(zoom/1.25);$('zoomin').onclick=()=>view==='3d'?cadIn():cadZoom(zoom*1.25);$('zoomreset').onclick=()=>view==='3d'?cadReset():cadFit();$('zoomreset').title='適合畫面';
const cadTools=renderViewTools;renderViewTools=function(){cadTools();let b=document.createElement('button');b.id='cadHand';b.textContent='✥ 平移';b.title='空白拖曳、滑鼠中鍵或空白鍵＋拖曳';b.className=cadHand?'on':'';b.hidden=view==='3d';b.onclick=()=>{cadHand=!cadHand;cadSVG.style.cursor=cadHand?'grab':'';b.classList.toggle('on',cadHand)};$('viewtools').append(b)};
