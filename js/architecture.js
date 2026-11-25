/* LOCALPLAN © 2026 project team. All rights reserved. */
// Geometry uses X,Z on the ground and Y for height internally. CAD UI uses X,Y,Z (up).
// New simple reusable voxel assets; the original BBMODEL packs are not changed.
function archModel(id,name,defaults,cubes){models[id]={id,name,category:'咖啡廳',note:'LOCALPLAN 基本幾何元件',defaults,cubes,rawSize:[1,1,1]}}
function roundSlab(y0,y1,n=12){let cs=[];for(let i=0;i<n;i++){let z=(i+.5)/n,r=Math.sqrt(Math.max(0,.25-(z-.5)**2));cs.push([.5-r,y0,i/n,.5+r,y1,(i+1)/n])}return cs}
archModel('round_table','圓桌',[1.15,1.15,.75,0,-1,.75],[...roundSlab(.9,1),[.43,.06,.43,.57,.9,.57],[.2,0,.2,.8,.06,.8]]);
archModel('cafe_stool','圓凳',[.45,.45,.48,0,-1,.48],[...roundSlab(.83,1,8),[.15,0,.15,.25,.83,.25],[.75,0,.15,.85,.83,.25],[.15,0,.75,.25,.83,.85],[.75,0,.75,.85,.83,.85]]);
archModel('long_table','長桌',[1.05,2.65,.75,0,-1,.75],[[0,.9,0,1,1,1],[.06,0,.04,.16,.9,.12],[.84,0,.04,.94,.9,.12],[.06,0,.88,.16,.9,.96],[.84,0,.88,.94,.9,.96]]);
archModel('wall_desk','靠窗桌',[.8,.65,.78,0,2,.78],[[0,.9,0,1,1,1],[.05,0,.05,.13,.9,.13],[.87,0,.05,.95,.9,.13],[.05,0,.87,.13,.9,.95],[.87,0,.87,.95,.9,.95]]);
archModel('toilet_fixture','馬桶',[.44,.7,.78,0,2,0],[[.08,.48,.01,.92,1,.28],[.19,0,.21,.81,.33,.76],[.07,.33,.2,.93,.56,.92],[.2,.56,.29,.8,.59,.81]]);
archModel('sink_counter','洗手台',[1.1,.6,.85,0,2,.85],[[.06,0,.1,.94,.83,.9],[0,.83,0,1,1,1],[.16,.98,.24,.84,1,.77],[.45,.85,.1,.55,1,.2]]);
archModel('coffee_roaster','烘豆機',[1.4,1.1,1.7,0,2,.85],[[.05,0,.08,.95,.45,.92],[.14,.45,.17,.86,.8,.83],[.22,.8,.32,.78,1,.68],[.18,.5,.03,.82,.66,.2],[.35,.8,.8,.65,.95,.98]]);
const archBuiltins=Object.fromEntries(['round_table','cafe_stool','long_table','wall_desk','toilet_fixture','sink_counter','coffee_roaster'].map(id=>[id,copy(models[id])]));
const cafeZones=[{name:'廁所',x:1.05,z:1.9},{name:'廁所洗手間',x:3.55,z:1.9},{name:'儲藏空間',x:2.65,z:5.3},{name:'用餐座位區',x:11.1,z:3.3},{name:'廚房',x:4.55,z:11.2},{name:'展示空間',x:7.15,z:8.55},{name:'櫃台區',x:11.25,z:8.68},{name:'咖啡工作區',x:11.3,z:10.85},{name:'烘豆區',x:15.6,z:10.6}];
function cafePreset(){
 for(let [id,m] of Object.entries(archBuiltins))if(!models[id])models[id]=copy(m);
 const W=18,D=13,units=[];let i=30;const add=(id,model,x,z,name,props={})=>{let u=Object.assign(unit(id||'u'+(++i),model,x,z,name),props);units.push(u);return u};
 const quiet={quiet:true,decor:true,clear:0}, wall=(x1,z1,x2,z2,props={})=>{let hor=z1===z2,len=Math.hypot(x2-x1,z2-z1);return add(null,'wall_segment',(x1+x2)/2,(z1+z2)/2,'牆段',{w:len,d:.16,h:2.7,rot:hor?0:1,locked:true,tone:'dark',...quiet,...props})};
 // Shell: keep actual doorway openings and a continuous raised window bay on north wall.
 wall(.16,.08,5.4,.08,{exterior:'north'});wall(15.1,.08,17.84,.08,{exterior:'north'});
 wall(5.4,.08,15.1,.08,{h:1.15,exterior:'north'});wall(5.4,.08,15.1,.08,{baseY:2.35,h:.35,exterior:'north'});
 for(let j=0;j<4;j++)add(j===0?'u15':null,'window',5.4+(j+.5)*9.7/4,.08,'前窗 '+(j+1),{...quiet,w:9.7/4,d:.16,h:1.2,baseY:1.15,locked:true,exterior:'north',windowOpen:true});
 wall(.08,.16,.08,12.84,{exterior:'west'});wall(.16,12.92,17.84,12.92,{exterior:'south'});
 wall(17.92,.16,17.92,6.75,{exterior:'east'});wall(17.92,8.55,17.92,12.84,{exterior:'east'});
 add('u14','door',17.92,7.65,'主入口',{...quiet,w:1.8,d:.16,h:2.2,rot:1,side:2,locked:true,doorOpen:true,exterior:'east'});
 wall(17.92,6.75,17.92,8.55,{baseY:2.2,h:.5,exterior:'east'});
 // Partition walls match the reference room arrangement, with usable doorways.
 wall(5.3,.16,5.3,2.4);wall(5.3,3.5,5.3,8.65);wall(2.0,.16,2.0,2.45);
 wall(.16,3.4,1.0,3.4);wall(2.2,3.4,5.22,3.4);
 wall(.16,7.2,1.25,7.2);wall(2.55,7.2,5.22,7.2);
 wall(5.38,8.75,8.9,8.75);wall(9.05,9.55,9.05,10.25);wall(9.05,11.5,9.05,12.84);
 wall(13.2,8.75,13.2,9.65);wall(13.2,10.9,13.2,12.84);wall(13.28,8.75,17.84,8.75);
 add(null,'toilet_fixture',.95,1.05,'馬桶',quiet);add(null,'sink_counter',3.65,.65,'洗手台',quiet);
 add(null,'rack_high',.65,5.0,'儲藏貨架',{...quiet,rot:1,w:2.4,d:.65});add(null,'rack_low',3.4,6.55,'儲藏低架',quiet);
 // Dining: eight individual window tables, seven wall bar stools, six long-table seats and two round four-seat groups.
 for(let j=0;j<8;j++){let x=6.05+j*1.13;add(null,'wall_desk',x,.85,'窗邊桌 '+(j+1),quiet);add(null,'cafe_chair',x,1.65,'窗邊椅 '+(j+1),{...quiet,rot:2})}
 add(null,'bar_counter',17.35,3.35,'靠牆長吧台',{...quiet,rot:1,w:5.7,d:.65,h:1.0});for(let j=0;j<7;j++)add(null,'cafe_stool',16.55,.9+j*.81,'吧台凳 '+(j+1),quiet);
 // Use cafe_table IDs for the simulated seating destinations; round geometry is a separate registered model.
 add('u8','long_table',7.25,5.55,'共用長桌',{...quiet,side:2});for(let j=0;j<3;j++)for(let side of [-1,1])add(null,'cafe_chair',7.25+side*.95,4.75+j*.8,'長桌椅',{...quiet,rot:side===-1?3:1});
 for(let [id,x,z] of [['u9',11.15,5.5],['u20',14.15,5.5]]){add(id,'round_table',x,z,'四人圓桌',{...quiet,side:2});for(let [dx,dz,rot] of [[-.9,-.9,0],[.9,-.9,0],[-.9,.9,2],[.9,.9,2]])add(null,'cafe_chair',x+dx,z+dz,'圓桌椅',{...quiet,rot})}
 // Display shelf and service counter. Customer and staff access sides are intentionally distinct.
 add(null,'rack_low',7.15,8.25,'展示架',{...quiet,w:3.25,d:.55,h:.85});
 add('u1','cashier_counter',10.05,8.85,'收銀台',{w:1.7,d:.8,side:0,clear:.5});
 add('u6','pickup_shelf',12.0,8.85,'取餐架',{w:1.5,d:.65,h:1.05,side:0,clear:.55});
 // Five counter stools are offset from the service port so customers can still approach.
 for(let j=0;j<5;j++)add(null,'cafe_stool',9.2+j*.69,7.45,'櫃台凳',quiet);
 add('u2','bar_counter',11.15,12.35,'咖啡操作台',{w:2.55,d:.8,side:0,clear:.65});add('u3','espresso_machine',11.1,12.35,'咖啡機',{baseY:1.25,clear:0});
 add('u4','prep_table',9.55,10.15,'備料台',{rot:1,w:1.1,d:.65,side:0,clear:.5});add('u5','wash_station',12.65,10.15,'清洗台',{rot:1,w:1.05,d:.65,side:2,clear:.45});
 add('u7','refrigerator',7.7,12.2,'冰箱',{side:0,clear:.65});add('kitchen_prep','prep_table',2.6,12.1,'廚房工作台',{w:3.0,side:0,clear:.7});add(null,'wash_station',.65,10.2,'廚房洗滌台',{rot:1,side:0,clear:.7});
 add(null,'coffee_roaster',16.8,11.85,'烘豆機',{side:0,clear:.7});add(null,'rack_low',14.75,12.25,'生豆架',{side:0,clear:.5});
 add('u17','standing_person',11.1,10.8,'店員',{clear:0,rot:2,operation:{from:'u4',to:'u2',pickup:3,drop:3}});
 return {name:'分區式咖啡廳',type:'cafe',W,D,units,links:[['u7','u4',20],['u4','u2',35],['u1','u6',30]].map(([a,b,f])=>({a,b,f})),id:'A',architecture:'cafe-zoned'};
}
// Customer paths include the new long/round tables. Keep original table support for imported layouts.
function isCafeSeat(u){return ['cafe_table','round_table','long_table'].includes(u.model)}
// The zoned cafe uses the same 0.25 m obstacle-aware navigation as the actor model; the older factory route is unchanged.
const archRoute=route;route=function(a,b,scene){if(scene.architecture!=='cafe-zoned'||viaPoints(scene,a.id,b.id).length)return archRoute(a,b,scene);let n=viaLayoutNav(scene),start=viaStation(n,a),end=viaStation(n,b),path=viaBfs(n,start,end);if(!path)return null;let p=[port(a),n.xy(start),...path.map(n.xy),port(b)];return {path:p,length:p.slice(1).reduce((v,q,i)=>v+Math.hypot(q[0]-p[i][0],q[1]-p[i][1]),0)}};
const archSetup=simSetup;simSetup=function(){archSetup();if(s.type!=='cafe')return;let seats=s.units.filter(isCafeSeat);SIM.seats=seats.map((u,i)=>({key:'seat'+i,cell:simStation(u),dwell:50})).filter(v=>v.cell>=0&&!!simPath(SIM.entry,v.cell));SIM.stations=SIM.stations.filter(q=>q.key!=='cafe_table');if(SIM.seats.length)SIM.stations.push({key:'cafe_table',cell:SIM.seats[0].cell})};
const archStopId=viaStopId;viaStopId=function(stop){if(stop?.key?.startsWith('seat'))return s.units.filter(isCafeSeat)[Number(stop.key.slice(4))]?.id;return archStopId(stop)};
// Window glass is omitted from opaque renderer so the frame remains a visible opening; original BBMODEL is retained.
function displayCubes(u){let c=simCubes(u);if(u.windowOpen)return c.filter(q=>!(q[3]-q[0]>.6&&q[4]-q[1]>.5&&q[5]-q[2]<.3));if(u.doorOpen)return [[0,0,0,.055,1,1],[.945,0,0,1,1,1],[0,.955,0,1,1,1]];return c}
let cutaway=true;
function architectureVisible(u){if(!cutaway||!u.exterior||view==='plan'||(view==='3d'&&cam.mode==='follow'))return true;let eye=view==='iso'?[s.W+5,8,s.D+5]:cameraActual().eye;return !((u.exterior==='south'&&eye[2]>s.D/2)||(u.exterior==='north'&&eye[2]<s.D/2)||(u.exterior==='east'&&eye[0]>s.W/2)||(u.exterior==='west'&&eye[0]<s.W/2))}
const archRenderScene=renderScene;renderScene=function(){archRenderScene();if(view!=='plan'||s.architecture!=='cafe-zoned')return;let o='';for(let q of cafeZones){let [x,y]=projectPlan(q.x,q.z);o+=`<text x="${x}" y="${y}" text-anchor="middle" font-size="${13/Math.sqrt(zoom)}" font-weight="600" fill="#697b80" stroke="var(--panel)" stroke-width="3" paint-order="stroke" pointer-events="none">${q.name}</text>`}$('scene').insertAdjacentHTML('beforeend',`<g aria-label="空間分區">${o}</g>`)};
const archTools=renderViewTools;renderViewTools=function(){archTools();if(view==='plan'||s.architecture!=='cafe-zoned')return;let b=document.createElement('button');b.id='cutaway';b.textContent=cutaway?'牆體：剖視':'牆體：完整';b.title='切換近側外牆顯示；碰撞與分析不變';b.onclick=()=>{cutaway=!cutaway;render()};$('viewtools').append(b)};
