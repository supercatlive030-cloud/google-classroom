/* ===============================
   CATS ARCADE APP.JS v5
================================ */

const SITE_PASSWORD = btoa("012312");

let allGames = [];
let playersOnline = 0;
let gameTimer = null;
let gameSeconds = 0;

/* ELEMENTS */

const loginScreen = document.getElementById("loginScreen");
const siteContent = document.getElementById("siteContent");
const loginError = document.getElementById("loginError");
const player = document.getElementById("player");

const chatName = document.getElementById("chatName");
const chatMessage = document.getElementById("chatMessage");

const bgColor = document.getElementById("bgColor");
const panicInput = document.getElementById("panicInput");

const reqName = document.getElementById("reqName");
const reqGames = document.getElementById("reqGames");

/* ===============================
STARTUP
================================ */

document.addEventListener("DOMContentLoaded", () => {

document.getElementById("loginForm").addEventListener("submit", e=>{
e.preventDefault();
checkSitePassword();
});

chatMessage.addEventListener("keydown", e=>{
if(e.key==="Enter") sendChat();
});

loadGames();
loadSettings();
loadChat();
updatePlayerCounter();

});

/* ===============================
LOGIN
================================ */

function checkSitePassword(){

const input=document.getElementById("sitePassword").value;

if(btoa(input)===SITE_PASSWORD){

loginScreen.style.display="none";
siteContent.style.display="block";

showPage("gamesPage");

notify("Welcome to Cats Arcade");

}else{

loginError.textContent="Wrong password";

}

}

/* ===============================
PAGE SYSTEM
================================ */

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.style.display="none";
});

const target=document.getElementById(page);

if(target) target.style.display="block";

if(page==="devPage") updateDevStats();

}

/* ===============================
PLAYER COUNTER
================================ */

function updatePlayerCounter(){

playersOnline=Math.floor(Math.random()*6)+1;

let counter=document.getElementById("playerCounter");

if(counter){
counter.textContent="Players Online: "+playersOnline;
}

setTimeout(updatePlayerCounter,15000);

}

/* ===============================
LOAD GAMES
================================ */

async function loadGames(){

try{

const res=await fetch("./games/games.json");
const data=await res.json();

allGames=data;

displayGames(allGames);

notify(allGames.length+" games loaded");

}catch(err){

console.error(err);
notify("Failed to load games");

}

}

/* ===============================
DISPLAY GAMES
================================ */

function displayGames(games){

const container=document.getElementById("games");

container.innerHTML="";

games.forEach(game=>{

const card=document.createElement("div");

card.className="game";

card.innerHTML=`
<h3>${game.title}</h3>
<button onclick="startGame('${game.path}')">Play</button>
`;

container.appendChild(card);

});

}

/* ===============================
SEARCH
================================ */

function searchGames(){

const input=document.getElementById("gameSearch").value.toLowerCase();

const filtered=allGames.filter(g=>
g.title.toLowerCase().includes(input)
);

displayGames(filtered);

}

/* ===============================
GAME PLAYER
================================ */

function startGame(path){

const wantTimer=confirm("Start a game timer?");

player.innerHTML=`
<div id="gameContainer">

<div id="loadingScreen">
<h2>Loading Game...</h2>
</div>

<button class="backBtn" onclick="exitGame()">Exit</button>

<iframe id="gameFrame" src="${path}"></iframe>

<div id="commentSection">

<h3>Game Feedback</h3>

<div id="gameComments"></div>

<input id="commentInput" placeholder="Leave feedback">
<button onclick="postComment()">Post</button>

</div>

</div>
`;

robotVoice();

setTimeout(()=>{
document.getElementById("loadingScreen").style.display="none";
},1500);

if(wantTimer){

gameSeconds=0;

gameTimer=setInterval(()=>{
gameSeconds++;
},1000);

}

loadComments();

notify("Game loading...");

}

/* ===============================
ROBOT VOICE
================================ */

function robotVoice(){

const msg=new SpeechSynthesisUtterance("The Cats Arcade");

msg.pitch=0.5;
msg.rate=0.8;

speechSynthesis.speak(msg);

}

/* ===============================
EXIT GAME
================================ */

function exitGame(){

clearInterval(gameTimer);

player.innerHTML="<p>No game loaded.</p>";

}

/* ===============================
RANDOM GAME
================================ */

function randomGame(){

if(allGames.length===0) return;

const random=allGames[Math.floor(Math.random()*allGames.length)];

startGame(random.path);

}

/* ===============================
SECRET DEV PANEL
================================ */

let secretTyped="";

document.addEventListener("keydown",e=>{

secretTyped=(secretTyped+e.key.toLowerCase()).slice(-10);

if(secretTyped.endsWith("micah4567")){

showPage("devPage");

notify("Developer panel opened");

secretTyped="";

}

});

/* ===============================
CHAT
================================ */

function sendChat(){

const name=chatName.value||"anon";
const msg=chatMessage.value;

if(msg==="") return;

addChat(name+": "+msg);

chatMessage.value="";

}

function addChat(text){

let chats=JSON.parse(localStorage.getItem("chatMessages"))||[];

chats.push(text);

if(chats.length>100) chats.shift();

localStorage.setItem("chatMessages",JSON.stringify(chats));

loadChat();

}

function loadChat(){

const box=document.getElementById("chatBox");

let chats=JSON.parse(localStorage.getItem("chatMessages"))||[];

box.innerHTML="";

chats.forEach(c=>{
const line=document.createElement("p");
line.textContent=c;
box.appendChild(line);
});

box.scrollTop=box.scrollHeight;

}

setInterval(loadChat,2000);

/* ===============================
COMMENTS
================================ */

function postComment(){

const input=document.getElementById("commentInput");
const msg=input.value;

if(msg==="") return;

let comments=JSON.parse(localStorage.getItem("comments"))||[];

comments.push(msg);

localStorage.setItem("comments",JSON.stringify(comments));

loadComments();

input.value="";

}

function loadComments(){

const box=document.getElementById("gameComments");

if(!box) return;

let comments=JSON.parse(localStorage.getItem("comments"))||[];

box.innerHTML="";

comments.forEach(c=>{
const p=document.createElement("p");
p.textContent=c;
box.appendChild(p);
});

}

/* ===============================
SETTINGS
================================ */

function saveSettings(){

const color=bgColor.value;

localStorage.setItem("bgColor",color);

document.body.style.background=color;

notify("Settings saved");

}

function loadSettings(){

const color=localStorage.getItem("bgColor");

if(color){
document.body.style.background=color;
bgColor.value=color;
}

}

/* ===============================
DARK MODE
================================ */

function toggleDarkMode(){

document.body.classList.toggle("dark");

}

/* ===============================
PANIC KEY
================================ */

function savePanic(){

localStorage.setItem("panicSite",panicInput.value);

notify("Panic site saved");

}

document.addEventListener("keydown",e=>{

if(e.key==="`"){

const site=localStorage.getItem("panicSite")||"https://google.com";

window.location.href=site;

}

});

/* ===============================
REQUESTS
================================ */

function submitRequest(){

if(reqName.value===""||reqGames.value===""){

notify("Fill all fields");

return;

}

let reqs=JSON.parse(localStorage.getItem("requests"))||[];

reqs.push(reqName.value+": "+reqGames.value);

localStorage.setItem("requests",JSON.stringify(reqs));

notify("Request sent!");

reqName.value="";
reqGames.value="";

}

/* ===============================
DEV PANEL
================================ */

function updateDevStats(){

const chats=JSON.parse(localStorage.getItem("chatMessages"))||[];
const reqs=JSON.parse(localStorage.getItem("requests"))||[];

document.getElementById("devGameCount").textContent=allGames.length;
document.getElementById("devChatCount").textContent=chats.length;
document.getElementById("devRequestCount").textContent=reqs.length;

}

function reloadGames(){
loadGames();
notify("Games reloaded");
}

function addGameDev(){

const title=prompt("Game title?");
const path=prompt("Game path?");

if(!title||!path) return;

allGames.push({title,path});

displayGames(allGames);

notify("Game added");

}

function removeLastGame(){

if(allGames.length===0) return;

const removed=allGames.pop();

displayGames(allGames);

notify("Removed "+removed.title);

}

function viewRequests(){

const reqs=JSON.parse(localStorage.getItem("requests"))||[];

console.log("Requests:",reqs);

alert("Requests printed to console");

}

function testGame(){

const url=prompt("Enter game URL");

if(!url) return;

player.innerHTML=`
<iframe src="${url}" style="width:100%;height:600px;border:none"></iframe>
`;

}

/* ===============================
DONATE
================================ */

function openDonate(){
window.open("https://ko-fi.com","_blank");
}

/* ===============================
NOTIFICATIONS
================================ */

function notify(message){

const container=document.getElementById("notifContainer");

const notif=document.createElement("div");

notif.className="notif";
notif.textContent=message;

container.appendChild(notif);

setTimeout(()=>{
notif.remove();
},4000);

}