(function(){
var cv=document.getElementById('c');
var renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
var scene=new THREE.Scene();
scene.background=new THREE.Color(0x0c2a4b);
scene.fog=new THREE.Fog(0x0c2a4b,14,34);
var cam=new THREE.PerspectiveCamera(45,1,.1,100);
scene.add(new THREE.HemisphereLight(0xcfe0ff,0x2a1d10,.9));
var sun=new THREE.DirectionalLight(0xffe2a8,1.1);sun.position.set(5,10,6);scene.add(sun);
var glow=new THREE.PointLight(0xf2b632,1.6,9);glow.position.set(0,6.4,0);scene.add(glow);

function mat(c,r){return new THREE.MeshStandardMaterial({color:c,roughness:r==null?.8:r,flatShading:true})}
function mesh(g,m,x,y,z){var o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o}

var world=new THREE.Group();scene.add(world);

/* ground with cracks */
world.add(mesh(new THREE.CylinderGeometry(7,7.4,.4,48),mat(0x4a3a2c,1),0,-.2,0));
var crackM=mat(0x1a120b,1);
for(var i=0;i<14;i++){var a=i/14*Math.PI*2+Math.random()*.3,len=1.5+Math.random()*3.2;
 var c=mesh(new THREE.BoxGeometry(.07,.03,len),crackM,Math.sin(a)*(2.2+len/2)*1,.01,Math.cos(a)*(2.2+len/2));c.rotation.y=a;world.add(c);}

/* figures */
var shirts=[0xc8302e,0x2f7fb8,0x3f8f5a,0xe8e1d0,0x8d5fa8];
var skins=[0x9b6a44,0xa87650,0x8a5a38,0xb07d58,0x95643f];
var figs=[];
function person(i){
 var g=new THREE.Group(),sk=mat(skins[i]),sh=mat(shirts[i]),pn=mat(0x2b2f3a);
 [-.2,.2].forEach(function(x){g.add(mesh(new THREE.CylinderGeometry(.13,.11,1.3,8),pn,x,.65,-.05))});
 var t=new THREE.Group();t.position.set(0,1.3,-.05);t.rotation.x=.45;g.add(t);
 t.add(mesh(new THREE.BoxGeometry(.7,1.3,.4),sh,0,.65,0));
 t.add(mesh(new THREE.SphereGeometry(.26,12,10),sk,0,1.6,.05));
 if(i==0)t.add(mesh(new THREE.CylinderGeometry(.5,.5,.06,16),mat(0xd9b45a),0,1.82,.05)); /* salakot */
 [-.42,.42].forEach(function(x){var arm=mesh(new THREE.CylinderGeometry(.09,.09,1,8),sk,x,2.85,.55);arm.rotation.x=-.12;g.add(arm)});
 var ang=i/5*Math.PI*2;
 g.position.set(Math.sin(ang)*2.3,0,Math.cos(ang)*2.3);
 g.rotation.y=ang+Math.PI;
 g.userData={t:t,ph:i*1.3};
 figs.push(g);world.add(g);
}
for(var k=0;k<5;k++)person(k);

/* slab */
var slab=new THREE.Group();slab.position.y=3.45;world.add(slab);
slab.add(mesh(new THREE.CylinderGeometry(3.5,3.3,.5,40),mat(0x6d6861,.95)));
slab.add(mesh(new THREE.CylinderGeometry(3.15,3.15,.12,40),mat(0x57524b,1),0,.3,0));

/* gold + official */
var gold=mat(0xf2b632,.3);gold.metalness=.7;
for(var j=0;j<46;j++){var r=Math.random()*2.3,an=Math.random()*6.28,h=.25-.0;
 var coin=mesh(new THREE.CylinderGeometry(.22,.22,.06,14),gold,Math.cos(an)*r,.36+Math.random()*.9*(1-r/2.6),Math.sin(an)*r);
 coin.rotation.set(Math.random()-.5,0,Math.random()-.5);slab.add(coin);}
for(var s=0;s<3;s++){var stack=new THREE.Group();stack.position.set(Math.cos(s*2.1+.6)*1.9,.35,Math.sin(s*2.1+.6)*1.9);
 for(var n=0;n<5+s*2;n++)stack.add(mesh(new THREE.CylinderGeometry(.3,.3,.09,16),gold,0,n*.1+.05,0));slab.add(stack);}
[[1.2,.2,.4],[-1.1,.2,-.8]].forEach(function(p){var b=new THREE.Group();b.position.set(p[0],.6,p[2]);
 b.add(mesh(new THREE.SphereGeometry(.5,14,12),mat(0xa8793a),0,0,0));b.add(mesh(new THREE.CylinderGeometry(.14,.2,.25,10),mat(0xa8793a),0,.5,0));
 b.add(mesh(new THREE.CylinderGeometry(.18,.18,.04,10),mat(0xf2b632),0,.7,0));slab.add(b);});
/* throne + official */
slab.add(mesh(new THREE.BoxGeometry(1.1,.7,1),gold,0,.65,-.2));
slab.add(mesh(new THREE.BoxGeometry(1.1,1.3,.2),gold,0,1.3,-.65));
var off=new THREE.Group();off.position.set(0,1.2,-.1);slab.add(off);
off.add(mesh(new THREE.CylinderGeometry(.35,.45,.9,12),mat(0x15171d),0,0,0));
off.add(mesh(new THREE.SphereGeometry(.28,12,10),mat(0xc99a78),0,.7,0));
off.add(mesh(new THREE.BoxGeometry(.06,.6,.02),mat(0xd2423a),0,.1,.4));
off.userData={};
var offTag=off;

/* eclipsed sun of the flag, far above */
var sunG=new THREE.Group();sunG.position.set(0,10.5,0);world.add(sunG);
var sd=mesh(new THREE.CircleGeometry(.9,32),new THREE.MeshBasicMaterial({color:0xf2b632,side:THREE.DoubleSide}));sunG.add(sd);
for(var q=0;q<8;q++){var ray=mesh(new THREE.ConeGeometry(.16,.9,3),new THREE.MeshBasicMaterial({color:0xf2b632}),Math.cos(q*.785)*1.5,Math.sin(q*.785)*1.5,0);
 ray.rotation.z=q*.785-Math.PI/2;sunG.add(ray);}
var shade=mesh(new THREE.CircleGeometry(.85,32),new THREE.MeshBasicMaterial({color:0x0c2a4b,side:THREE.DoubleSide}),.45,-.2,.02);sunG.add(shade);

/* camera orbit */
var yaw=.6,pitch=.28,dist=15,auto=true,dragging=false,lx=0,ly=0,pd={};
cv.addEventListener('pointerdown',function(e){dragging=true;lx=e.clientX;ly=e.clientY;pd[e.pointerId]=e;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointerup',function(e){delete pd[e.pointerId];dragging=Object.keys(pd).length>0});
cv.addEventListener('pointermove',function(e){
 if(!pd[e.pointerId])return;var ids=Object.keys(pd);
 if(ids.length==2){var o=pd[ids.find(function(k){return k!=e.pointerId})];
  var d0=Math.hypot(pd[e.pointerId].clientX-o.clientX,pd[e.pointerId].clientY-o.clientY),d1=Math.hypot(e.clientX-o.clientX,e.clientY-o.clientY);
  dist=Math.min(26,Math.max(8,dist*(d0/(d1||1))));pd[e.pointerId]=e;return;}
 pd[e.pointerId]=e;yaw-=(e.clientX-lx)*.008;pitch=Math.min(1.2,Math.max(-.1,pitch+(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY;});
cv.addEventListener('wheel',function(e){e.preventDefault();dist=Math.min(26,Math.max(8,dist+e.deltaY*.01))},{passive:false});
var btn=document.getElementById('spin');
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){auto=false;btn.textContent='Resume rotation'}
btn.onclick=function(){auto=!auto;btn.textContent=auto?'Pause rotation':'Resume rotation'};

function resize(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

var t0=performance.now();
function loop(now){
 var t=(now-t0)/1000;
 if(auto&&!dragging)yaw+=.0025;
 var tgt=new THREE.Vector3(0,4.2,0);
 cam.position.set(Math.sin(yaw)*Math.cos(pitch)*dist,tgt.y+Math.sin(pitch)*dist,Math.cos(yaw)*Math.cos(pitch)*dist);
 cam.lookAt(tgt);
 var load=reduce?0:Math.sin(t*1.6);
 figs.forEach(function(f){f.userData.t.rotation.x=.45+.04*Math.sin(t*1.6+f.userData.ph)});
 slab.position.y=3.45-.03*(1+load)/2;
 glow.intensity=1.4+.3*Math.sin(t*2);
 renderer.render(scene,cam);
 requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
