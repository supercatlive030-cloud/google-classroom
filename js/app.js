/* ===============================
   CATS ARCADE APP.JS v6
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

/* ===============================
STARTUP
================================ */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("loginForm").addEventListener("submit", e=>{
        e.preventDefault();
        checkSitePassword();
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

    const input = document.getElementById("sitePassword").value;

    if(btoa(input) === SITE_PASSWORD){

        loginScreen.style.display = "none";
        siteContent.style.display = "block";

        showPage("gamesPage");

        notify("Welcome to Cats Arcade");

    } else {
        loginError.textContent = "Wrong password";
    }

}

/* ===============================
PAGE SYSTEM
================================ */

function showPage(page){

    document.querySelectorAll(".page").forEach(p=>{
        p.style.display = "none";
    });

    const target = document.getElementById(page);
    if(target) target.style.display = "block";

    if(page === "devPage") updateDevStats();

}

/* ===============================
PLAYER COUNTER
================================ */

function updatePlayerCounter(){

    playersOnline = Math.floor(Math.random()*6)+1;

    const counter = document.getElementById("playerCounter");
    if(counter){
        counter.textContent = "Players Online: " + playersOnline;
    }

    setTimeout(updatePlayerCounter,15000);

}

/* ===============================
LOAD GAMES
================================ */

async function loadGames(){

    try{

        const res = await fetch("./games/games.json");
        const data = await res.json();

        allGames = data;

        displayGames(allGames);

        notify(allGames.length + " games loaded");

    }catch(err){

        console.error("GAME LOAD ERROR:", err);
        notify("Failed to load games");

    }

}

/* ===============================
DISPLAY GAMES
================================ */

function displayGames(games){

    const container = document.getElementById("games");
    if(!container) return;

    container.innerHTML = "";

    games.forEach(game=>{

        const card = document.createElement("div");
        card.className = "game";

        card.innerHTML = `
        <h3>${game.title}</h3>
        <button onclick="startGame('${game.path}')">Play</button>
        `;

        container.appendChild(card);

    });

}

/* ===============================
GAME PLAYER (FIXED)
================================ */

function startGame(path){

    clearInterval(gameTimer);

    const wantTimer = confirm("Start a game timer?");

    player.innerHTML = `
    <div id="gameContainer">

        <div id="loadingScreen">
            <h2>Loading Game...</h2>
        </div>

        <button class="backBtn" onclick="exitGame()">Exit</button>

        <iframe id="gameFrame" src="${path}"></iframe>

        <p id="gameTimerDisplay"></p>

    </div>
    `;

    const frame = document.getElementById("gameFrame");

    /* 🔥 ERROR DETECTION */
    frame.onload = () => {
        document.getElementById("loadingScreen").style.display = "none";
        notify("Game loaded");
    };

    frame.onerror = () => {
        notify("Game failed to load ❌");
        console.error("Broken game path:", path);
        exitGame();
    };

    /* TIMER */

    if(wantTimer){

        gameSeconds = 0;

        gameTimer = setInterval(()=>{
            gameSeconds++;

            const display = document.getElementById("gameTimerDisplay");
            if(display){
                display.textContent = "Time: " + gameSeconds + "s";
            }

        },1000);

    }

}

/* ===============================
EXIT GAME
================================ */

function exitGame(){

    clearInterval(gameTimer);

    player.innerHTML = "<p>No game loaded.</p>";

}

/* ===============================
SEARCH
================================ */

function searchGames(){

    const input = document.getElementById("gameSearch").value.toLowerCase();

    const filtered = allGames.filter(g =>
        g.title.toLowerCase().includes(input)
    );

    displayGames(filtered);

}

/* ===============================
RANDOM GAME
================================ */

function randomGame(){

    if(allGames.length === 0) return;

    const random = allGames[Math.floor(Math.random()*allGames.length)];

    startGame(random.path);

}

/* ===============================
SECRET DEV PANEL
================================ */

let secretTyped = "";

document.addEventListener("keydown", e=>{

    secretTyped = (secretTyped + e.key.toLowerCase()).slice(-15);

    if(secretTyped.endsWith("micah4567")){

        showPage("devPage");
        notify("Developer panel opened");

        secretTyped = "";

    }

});

/* ===============================
CHAT (SAFE)
================================ */

function sendChat(){

    const name = document.getElementById("chatName").value || "anon";
    const msg = document.getElementById("chatMessage").value;

    if(msg === "") return;

    let chats = JSON.parse(localStorage.getItem("chatMessages")) || [];

    chats.push(name + ": " + msg);

    if(chats.length > 100) chats.shift();

    localStorage.setItem("chatMessages", JSON.stringify(chats));

    document.getElementById("chatMessage").value = "";

    loadChat();

}

function loadChat(){

    const box = document.getElementById("chatBox");
    if(!box) return;

    let chats = JSON.parse(localStorage.getItem("chatMessages")) || [];

    box.innerHTML = "";

    chats.forEach(c=>{
        const line = document.createElement("p");
        line.textContent = c;
        box.appendChild(line);
    });

}

/* ===============================
SETTINGS
================================ */

function saveSettings(){

    const color = document.getElementById("bgColor").value;

    localStorage.setItem("bgColor", color);
    document.body.style.background = color;

    notify("Settings saved");

}

function loadSettings(){

    const color = localStorage.getItem("bgColor");

    if(color){
        document.body.style.background = color;
        document.getElementById("bgColor").value = color;
    }

}

/* ===============================
DEV PANEL
================================ */

function updateDevStats(){

    const chats = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const reqs = JSON.parse(localStorage.getItem("requests")) || [];

    document.getElementById("devGameCount").textContent = allGames.length;
    document.getElementById("devChatCount").textContent = chats.length;
    document.getElementById("devRequestCount").textContent = reqs.length;

}

/* ===============================
NOTIFICATIONS
================================ */

function notify(message){

    const container = document.getElementById("notifContainer");
    if(!container) return;

    const notif = document.createElement("div");

    notif.className = "notif";
    notif.textContent = message;

    container.appendChild(notif);

    setTimeout(()=>{
        notif.remove();
    },4000);

}