const SITE_PASSWORD = "012312"
const DEV_PASSWORD = "7995"

let allGames = []

document.addEventListener("DOMContentLoaded", () => {

loadGames()
loadUpdates()

})

/* LOAD GAMES */

function loadGames(){

// try loading from normal folder first
fetch("games/games.json")

.then(response => {

if(!response.ok){
throw new Error("games folder not found")
}

return response.json()

})

.then(games => {

allGames = games
displayGames(games)

})

// if that fails, try the folder with a space
.catch(() => {

fetch("games copy/games.json")

.then(response => {

if(!response.ok){
throw new Error("games.json not found")
}

return response.json()

})

.then(games => {

allGames = games
displayGames(games)

})

.catch(error => {

console.log("Game loading error:", error)

})

})

}

/* SHOW GAMES */

function displayGames(games){

const container = document.getElementById("games")

if(!container) return

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

/* START GAME */

function startGame(path){

const player = document.getElementById("player")

player.innerHTML = `
<button onclick="exitGame()">⬅ Exit Game</button>
<iframe src="${path}" width="100%" height="600" style="border:none;"></iframe>
`

}

/* EXIT GAME */

function exitGame(){

document.getElementById("player").innerHTML = "<p>No game loaded</p>"

}

/* PAGE SWITCHING */

function showPage(page){

const pages = document.querySelectorAll(".page")

pages.forEach(p => p.style.display = "none")

document.getElementById(page).style.display = "block"

}

/* LOGIN */

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

/* REQUEST SYSTEM */

function submitRequest(){

const name = document.getElementById("reqName").value
const games = document.getElementById("reqGames").value
const ideas = document.getElementById("reqIdeas").value
const bug = document.getElementById("reqBug").value

let requests = JSON.parse(localStorage.getItem("requests")) || []

requests.push({name,games,ideas,bug})

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

/* LOAD REQUESTS */

function loadRequests(){

const list = document.getElementById("devRequests")

if(!list) return

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

/* UPDATE SYSTEM */

function addUpdate(){

const text = document.getElementById("updateInput").value.trim()

if(text === "") return

let updates = JSON.parse(localStorage.getItem("updates")) || []

updates.unshift(text)

localStorage.setItem("updates", JSON.stringify(updates))

document.getElementById("updateInput").value = ""

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