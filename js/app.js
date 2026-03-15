const SITE_PASSWORD = btoa("012312")

let attempts = 0
let allGames = []

document.addEventListener("DOMContentLoaded", () => {

loadGames()
loadSettings()

})

/* LOGIN */

function checkSitePassword(){

const input = document.getElementById("sitePassword").value

if(btoa(input) === SITE_PASSWORD){

document.getElementById("loginScreen").style.display = "none"
document.getElementById("siteContent").style.display = "block"

showPage("gamesPage")

}else{

attempts++

document.getElementById("loginError").textContent = "Wrong password"

if(attempts >= 3){
document.getElementById("sitePassword").disabled = true
document.getElementById("loginError").textContent = "Too many attempts"
}

}

}

/* PAGE SYSTEM */

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.style.display = "none"
})

document.getElementById(page).style.display = "block"

}

/* LOAD GAMES */

function loadGames(){

fetch("games/games.json")
.then(res => res.json())
.then(data => {

allGames = data
displayGames(data)

})
.catch(()=>{

document.getElementById("games").innerHTML = "No games available."

})

}

function displayGames(games){

const container = document.getElementById("games")
container.innerHTML = ""

games.forEach(game=>{

const card = document.createElement("div")
card.className = "game"   // FIXED styling

const title = document.createElement("h3")
title.textContent = game.title

const btn = document.createElement("button")
btn.textContent = "Play"
btn.onclick = () => startGame(game.path)

card.appendChild(title)
card.appendChild(btn)

container.appendChild(card)

})

}

/* GAME PLAYER (FULLSCREEN FIX) */

function startGame(path){

const player = document.getElementById("player")

player.innerHTML = `
<div id="gameContainer">
<button onclick="exitGame()" class="backBtn">Exit</button>
<iframe id="gameFrame" src="${path}" allowfullscreen></iframe>
</div>
`

}

function exitGame(){

document.getElementById("player").innerHTML = "<p>No game loaded.</p>"

}

/* SETTINGS */

function saveSettings(){

const color = document.getElementById("bgColor").value

localStorage.setItem("bgColor", color)

document.body.style.background = color

}

function loadSettings(){

const color = localStorage.getItem("bgColor")

if(color){

document.body.style.background = color

const picker = document.getElementById("bgColor")
if(picker) picker.value = color

}

}

/* REQUESTS */

function submitRequest(){

let requests = JSON.parse(localStorage.getItem("requests")) || []

requests.push({
name:document.getElementById("reqName").value,
games:document.getElementById("reqGames").value,
ideas:document.getElementById("reqIdeas").value,
bug:document.getElementById("reqBug").value
})

localStorage.setItem("requests", JSON.stringify(requests))

alert("Request submitted")

}

/* MOVIE TAB (ABOUT:BLANK FIX) */

function openMovieTab(){

const newTab = window.open("about:blank","_blank")

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

<iframe src="https://www.cineby.gd/"></iframe>

</body>
</html>
`)

newTab.document.close()

}