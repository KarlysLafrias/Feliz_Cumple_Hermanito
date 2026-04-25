const startScreen=document.getElementById("startScreen");
const scene=document.getElementById("scene");
const envelope=document.getElementById("envelope");
const canvas=document.getElementById("confetti");
const ctx=canvas.getContext("2d");
const bgMusic=document.getElementById("bgMusic");
const startVideo=document.getElementById("startVideo");
const pieces=[];

let confettiTimer=null;
let confettiStopTimer=null;
let hasOpenedEnvelope=false;

if(bgMusic){
bgMusic.volume=0.35;
bgMusic.addEventListener("ended",stopConfetti);
}

function start(){
startScreen.style.display="none";
scene.style.display="flex";

if(startVideo){
startVideo.pause();
}

playBackgroundMusic();
resizeCanvas();
}

function openEnvelope(){
if(hasOpenedEnvelope){
return;
}

hasOpenedEnvelope=true;
envelope.classList.add("open");

setTimeout(()=>{
startConfetti();
},450);
}

function playBackgroundMusic(){
if(!bgMusic){
return;
}

const playPromise=bgMusic.play();

if(playPromise!==undefined){
playPromise.catch(()=>{});
}
}

function resizeCanvas(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}

function createPiece(fromTop=false){
return{
x:Math.random()*canvas.width,
y:fromTop ? Math.random()*-canvas.height*0.8 : Math.random()*canvas.height,
size:Math.random()*8+4,
speedY:Math.random()*4+3,
speedX:(Math.random()-0.5)*2.2,
rotation:Math.random()*360,
rotationSpeed:(Math.random()-0.5)*10,
color:`hsl(${Math.random()*360},100%,50%)`
};
}

function fillConfetti(fromTop=false){
pieces.length=0;

for(let i=0;i<220;i++){
pieces.push(createPiece(fromTop));
}
}

function startConfetti(){
fillConfetti(true);

if(confettiTimer!==null){
clearInterval(confettiTimer);
}

if(confettiStopTimer!==null){
clearTimeout(confettiStopTimer);
}

confettiTimer=setInterval(draw,20);

scheduleConfettiStop();
}

function scheduleConfettiStop(){
const remainingSongTime=getRemainingSongTime();

if(remainingSongTime!==null){
confettiStopTimer=setTimeout(stopConfetti,remainingSongTime);
return;
}

confettiStopTimer=setTimeout(stopConfetti,6500);
}

function getRemainingSongTime(){
if(!bgMusic || !Number.isFinite(bgMusic.duration) || bgMusic.duration<=0){
return null;
}

const remaining=(bgMusic.duration-bgMusic.currentTime)*1000;

if(remaining<=0){
return null;
}

return remaining;
}

function stopConfetti(){
if(confettiTimer!==null){
clearInterval(confettiTimer);
confettiTimer=null;
}

if(confettiStopTimer!==null){
clearTimeout(confettiStopTimer);
confettiStopTimer=null;
}

ctx.clearRect(0,0,canvas.width,canvas.height);
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);

pieces.forEach(piece=>{
ctx.save();
ctx.translate(piece.x,piece.y);
ctx.rotate(piece.rotation*Math.PI/180);
ctx.fillStyle=piece.color;
ctx.fillRect(-piece.size/2,-piece.size/2,piece.size,piece.size*0.7);
ctx.restore();

piece.x+=piece.speedX;
piece.y+=piece.speedY;
piece.rotation+=piece.rotationSpeed;

if(piece.y>canvas.height+20){
piece.y=Math.random()*-120-20;
piece.x=Math.random()*canvas.width;
}
});
}

resizeCanvas();
fillConfetti();
window.addEventListener("resize",resizeCanvas);
