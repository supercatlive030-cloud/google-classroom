const SITE_PASSWORD = "012312"
const DEV_PASSWORD = "7995"

let allGames = []

document.addEventListener("DOMContentLoaded", () => {

fetch("games copy/games.json")
.then(r => r.json())
.then(games => {

allGames = games
displayGames(games)

})

loadUpdates()

})


function checkSitePassword(){

const input = document.getElementById("sitePassword").value

if(input === SITE_PASSWORD){

document.getElementById("loginScreen").style.display = "none"
document.getElementById("siteContent").style.display = "block"

showPage("gamesPage")

}else{

document.getElementById("loginError").textContent = "Wrong password"

}

}


function displayGames(games){

const container = document.getElementById("games")

container.innerHTML = ""

games.forEach(game => {

const card = document.createElement("div")
card.className = "game"

const title = document.createElement("h3")
title.textContent = game.title

const button = document.createElement("button")
button.textContent = "Play"

button.onclick = () => startGame(game.path)

card.appendChild(title)
card.appendChild(button)

container.appendChild(card)

})

}


function startGame(path){

const player = document.getElementById("player")

player.innerHTML = `
<div id="gameContainer">
<button onclick="exitGame()">Exit Game</button>
<iframe src="${path}" width="100%" height="600"></iframe>
</div>
`

}


function exitGame(){

document.getElementById("player").innerHTML = "<p>No game loaded</p>"

}


function showPage(page){

document.querySelectorAll(".page").forEach(p => p.style.display = "none")

document.getElementById(page).style.display = "block"

}


/* REQUEST SYSTEM */

function submitRequest(){

const name = document.getElementById("reqName").value
const games = document.getElementById("reqGames").value
const ideas = document.getElementById("reqIdeas").value
const bug = document.getElementById("reqBug").value

let requests = JSON.parse(localStorage.getItem("requests")) || []

requests.push({name, games, ideas, bug})

localStorage.setItem("requests", JSON.stringify(requests))

alert("Request submitted")

}


/* DEV LOGIN */

function devLogin(){

const pass = prompt("Developer Password")

if(pass === DEV_PASSWORD){

showPage("devPage")
loadRequests()

}

}


/* VIEW REQUESTS */

function loadRequests(){

const list = document.getElementById("devRequests")
list.innerHTML = ""

const requests = JSON.parse(localStorage.getItem("requests")) || []

requests.forEach(r => {

const item = document.createElement("li")

item.innerHTML = `
<b>Name:</b> ${r.name}<br>
<b>Games:</b> ${r.games}<br>
<b>Ideas:</b> ${r.ideas}<br>
<b>Bug:</b> ${r.bug}
`

list.appendChild(item)

})

}


/* UPDATES */

function addUpdate(){

const text = document.getElementById("updateInput").value

if(!text) return

let updates = JSON.parse(localStorage.getItem("updates")) || []

updates.unshift(text)

localStorage.setItem("updates", JSON.stringify(updates))

loadUpdates()

}


function loadUpdates(){

const list = document.getElementById("updateList")

if(!list) return

list.innerHTML = ""

const updates = JSON.parse(localStorage.getItem("updates")) || []

updates.forEach(u => {

const item = document.createElement("li")
item.textContent = u

list.appendChild(item)

})

}