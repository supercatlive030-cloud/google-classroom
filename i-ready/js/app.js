document.addEventListener("DOMContentLoaded", () => {

showPage("gamesPage")

loadSettings()

fetch("games copy/games.json")
.then(response => response.json())
.then(games => {

const container = document.getElementById("games")
container.innerHTML = ""

games.forEach(game => {

const card = document.createElement("div")
card.className = "game"

const title = document.createElement("h3")
title.textContent = game.title

const button = document.createElement("button")
button.textContent = "Play"

button.onclick = () => {

playIntro()
startGame(game.path)

}

card.appendChild(title)
card.appendChild(button)

container.appendChild(card)

})

})

.catch(err => console.log("Game loading error:", err))

})

/* GAME PLAYER */

function startGame(path){

const player = document.getElementById("player")

player.innerHTML = `
<button onclick="exitGame()" class="backBtn">⬅ Back</button>
<iframe src="${path}" class="gameFrame"></iframe>
`

}

function exitGame(){

document.getElementById("player").innerHTML = "<p>No game loaded.</p>"

}

/* INTRO VOICE */

function playIntro(){

const speech = new SpeechSynthesisUtterance("Welcome to The Cats Arcade")

speech.rate = 0.9
speech.pitch = 0.7

speechSynthesis.speak(speech)

}

/* PAGE NAVIGATION */

function showPage(page){

const pages = document.querySelectorAll(".page")

pages.forEach(p => {
p.style.display = "none"
})

document.getElementById(page).style.display = "block"

}

/* SETTINGS */

function saveSettings(){

const color = document.getElementById("bgColor").value
const key = document.getElementById("panicKey").value

sessionStorage.setItem("bgColor", color)
sessionStorage.setItem("panicKey", key)

document.body.style.background = color

}

/* LOAD SETTINGS */

function loadSettings(){

const savedColor = sessionStorage.getItem("bgColor")

if(savedColor){
document.body.style.background = savedColor
}

}

/* RESET SETTINGS */

function resetSettings(){

sessionStorage.clear()

document.body.style.background = "#0a0a0a"

alert("Settings Reset")

}

/* PANIC KEY */

document.addEventListener("keydown", function(e){

const panicKey = sessionStorage.getItem("panicKey") || "`"

if(e.key === panicKey){

window.location.href = "https://classroom.google.com"

}

})