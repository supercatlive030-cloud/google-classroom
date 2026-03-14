const SITE_PASSWORD = btoa("012312")
const DEV_PASSWORD = "7995"

let attempts = 0
let allGames = []

document.addEventListener("DOMContentLoaded", () => {

const passwordInput = document.getElementById("sitePassword")

passwordInput.addEventListener("keydown", e=>{
if(e.key==="Enter") checkSitePassword()
})

loadGames()
loadUpdates()
trackVisitors()
startParallax()

})

/* LOAD GAMES */

function loadGames(){

fetch("games/games.json")
.then(res=>res.json())
.then(data=>{
allGames = data
displayGames(data)
})
.catch(()=>{
console.log("games.json not found")
})

}

/* LOGIN */

function checkSitePassword(){

const input=document.getElementById("sitePassword").value

if(btoa(input)===SITE_PASSWORD){

document.getElementById("loginScreen").style.display="none"
document.getElementById("siteContent").style.display="block"

showPage("gamesPage")

}else{

attempts++

document.getElementById("loginError").textContent="Wrong password"

if(attempts>=3){

document.getElementById("loginError").textContent="Too many attempts"
document.getElementById("sitePassword").disabled=true

}

}

}

/* DISPLAY GAMES */

function displayGames(games){

const container=document.getElementById("games")
container.innerHTML=""

games.forEach(game=>{

const card=document.createElement("div")
card.className="game"

const title=document.createElement("h3")
title.textContent=game.title

const button=document.createElement("button")
button.textContent="Play"

button.onclick=()=>startGame(game.path)

card.appendChild(title)
card.appendChild(button)

container.appendChild(card)

})

}

/* START GAME */

function startGame(path){

const player=document.getElementById("player")

player.innerHTML=`
<div id="gameContainer">
<button onclick="exitGame()" class="backBtn">⬅ Exit Game</button>
<iframe id="gameFrame" src="${path}"></iframe>
</div>
`

}

function exitGame(){
document.getElementById("player").innerHTML="<p>No game loaded.</p>"
}

/* PAGE SYSTEM */

function showPage(page){

document.querySelectorAll(".page").forEach(p=>p.style.display="none")

document.getElementById(page).style.display="block"

}

/* SETTINGS */

function saveSettings(){

const color=document.getElementById("bgColor").value

localStorage.setItem("bgColor",color)

document.body.style.background=color

}

/* REQUEST SYSTEM */

function submitRequest(){

const name=document.getElementById("reqName").value
const games=document.getElementById("reqGames").value
const ideas=document.getElementById("reqIdeas").value
const bug=document.getElementById("reqBug").value

let requests=JSON.parse(localStorage.getItem("requests"))||[]

requests.push({name,games,ideas,bug})

localStorage.setItem("requests",JSON.stringify(requests))

alert("Request submitted")

}

/* DEV LOGIN */

function openDevLogin(){
document.getElementById("devLoginBox").style.display="block"
}

function enterDev(){

const pass=document.getElementById("devPassword").value

if(pass===DEV_PASSWORD){

document.getElementById("devLoginBox").style.display="none"

showPage("devPage")

loadRequests()

}else{

document.getElementById("devError").textContent="Wrong password"

}

}

/* VIEW REQUESTS */

function loadRequests(){

const list=document.getElementById("devRequests")
list.innerHTML=""

const requests=JSON.parse(localStorage.getItem("requests"))||[]

requests.forEach(r=>{

const item=document.createElement("li")

item.innerHTML=`
<b>Name:</b> ${r.name}<br>
<b>Games:</b> ${r.games}<br>
<b>Ideas:</b> ${r.ideas}<br>
<b>Bug:</b> ${r.bug}<br><br>
`

list.appendChild(item)

})

}

/* UPDATES */

function addUpdate(){

const text=document.getElementById("updateInput").value.trim()

if(text==="") return

let updates=JSON.parse(localStorage.getItem("updates"))||[]

updates.unshift(text)

localStorage.setItem("updates",JSON.stringify(updates))

loadUpdates()

}

function loadUpdates(){

const list=document.getElementById("updateList")

if(!list) return

list.innerHTML=""

const updates=JSON.parse(localStorage.getItem("updates"))||[]

updates.forEach(u=>{

const item=document.createElement("li")
item.textContent=u

list.appendChild(item)

})

}

/* VISITOR STATS */

function trackVisitors(){

let total=localStorage.getItem("totalVisitors")||0
total++

localStorage.setItem("totalVisitors",total)

let today=localStorage.getItem("todayVisitors")||0
today++

localStorage.setItem("todayVisitors",today)

document.getElementById("totalVisitors").textContent=total
document.getElementById("todayVisitors").textContent=today

document.getElementById("onlineUsers").textContent=Math.floor(Math.random()*5)+1

}

/* PARALLAX */

function startParallax(){

let px=0
let py=0

setInterval(()=>{

px+=0.002
py+=0.002

const l1=document.querySelector(".layer1")
const l2=document.querySelector(".layer2")
const l3=document.querySelector(".layer3")

if(!l1||!l2||!l3) return

l1.style.transform=`translate(${Math.sin(px)*20}px,${Math.cos(py)*20}px)`
l2.style.transform=`translate(${Math.sin(px)*40}px,${Math.cos(py)*40}px)`
l3.style.transform=`translate(${Math.sin(px)*70}px,${Math.cos(py)*70}px)`

},30)

}

/* OPEN ARCADE TAB */

function openArcadeTab(){

const newTab=window.open("about:blank","_blank")

if(!newTab){
alert("Popup blocked")
return
}

newTab.document.write(`
<html>
<head>
<title>Student Resources</title>
<style>
body{margin:0}
iframe{
position:fixed;
top:0;
left:0;
width:100vw;
height:100vh;
border:none;
}
</style>
</head>
<body>
<iframe src="${window.location.href}"></iframe>
</body>
</html>
`)

newTab.document.close()

<<<<<<< HEAD
}
=======
}
>>>>>>> b1a73ae2d726166cf824fe4f5123847b39b06e2a
