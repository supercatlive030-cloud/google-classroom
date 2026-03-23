const SITE_PASSWORD = "012312";
const CALC_CODE = "2312";

let calc = "0";
let allGames = [];

document.addEventListener("DOMContentLoaded", () => {
  const calcDisplay = document.getElementById("calcDisplay");
  const calcLock = document.getElementById("calcLock");

  const loginScreen = document.getElementById("loginScreen");
  const loginForm = document.getElementById("loginForm");
  const sitePassword = document.getElementById("sitePassword");
  const loginError = document.getElementById("loginError");

  const siteContent = document.getElementById("siteContent");

  const gamesDiv = document.getElementById("games");
  const player = document.getElementById("player");
  const gameSearch = document.getElementById("gameSearch");

  const chatBox = document.getElementById("chatBox");
  const chatName = document.getElementById("chatName");
  const chatMessage = document.getElementById("chatMessage");

  const giftList = document.getElementById("giftList");
  const giftName = document.getElementById("giftName");
  const giftCode = document.getElementById("giftCode");

  /* CALCULATOR */
  window.calcInput = (v) => {
    calc = calc==="0"?v:calc+v;
    calcDisplay.value = calc;
  };

  window.calcClear = () => {
    calc = "0";
    calcDisplay.value = calc;
  };

  window.calcEnter = () => {
    if(calc === CALC_CODE){
      calcLock.style.display="none";
      loginScreen.style.display="flex";
      calc="0";
      calcDisplay.value = calc;
      return;
    }

    try{
      calc = Function("return ("+calc+")")().toString();
    }catch{
      calc = "0";
    }
    calcDisplay.value = calc;
  };

  /* LOGIN */
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    if(sitePassword.value === SITE_PASSWORD){
      loginScreen.style.display="none";
      siteContent.style.display="block";
      showPage("gamesPage");
      loadGames();
      loadChat();
      loadGifts();
    } else {
      loginError.textContent = "Wrong password";
      sitePassword.value = "";
    }
  });

  /* GAMES */
  async function loadGames(){
    try{
      let res = await fetch("./games/games.json");
      allGames = await res.json();
      displayGames(allGames);
    }catch{
      gamesDiv.innerHTML="No games found";
    }
  }

  function displayGames(g){
    gamesDiv.innerHTML="";
    g.forEach(game=>{
      let d=document.createElement("div");
      d.className="game";

      let title = document.createElement("h3");
      title.textContent = game.title;

      let btn = document.createElement("button");
      btn.textContent = "Play";
      btn.addEventListener("click", ()=>startGame(game.path));

      d.appendChild(title);
      d.appendChild(btn);
      gamesDiv.appendChild(d);
    });
  }

  window.startGame = (path)=>{
    player.innerHTML=`
    <div id="gameContainer">
      <button class="exitBtn" onclick="exitGame()">✖</button>
      <iframe src="${path}"></iframe>
    </div>`;
  };

  window.exitGame = ()=>{ player.innerHTML="<p>No game loaded.</p>"; };
  window.searchGames = ()=>{ displayGames(allGames.filter(g=>g.title.toLowerCase().includes(gameSearch.value.toLowerCase()))); };
  window.randomGame = ()=>{ if(!allGames.length) return; startGame(allGames[Math.floor(Math.random()*allGames.length)].path); };
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") exitGame(); });

  /* CHAT */
  window.sendChat = ()=>{
    if(!chatMessage.value.trim()) return;
    let chats = JSON.parse(localStorage.getItem("chat")) || [];
    chats.push((chatName.value||"Anon")+": "+chatMessage.value);
    localStorage.setItem("chat", JSON.stringify(chats));
    chatMessage.value="";
    loadChat();
  };

  function loadChat(){
    let chats = JSON.parse(localStorage.getItem("chat")) || [];
    chatBox.innerHTML="";
    chats.forEach(c=>{
      let p=document.createElement("p");
      p.textContent=c;
      chatBox.appendChild(p);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  /* GIFTS */
  window.submitGift = ()=>{
    if(!giftCode.value.trim()) return;
    let gifts = JSON.parse(localStorage.getItem("gifts")) || [];
    gifts.push({ name: giftName.value||"Anon", code: giftCode.value });
    localStorage.setItem("gifts", JSON.stringify(gifts));
    giftName.value=""; giftCode.value="";
    loadGifts();
  };

  function loadGifts(){
    let gifts = JSON.parse(localStorage.getItem("gifts")) || [];
    giftList.innerHTML="";
    gifts.forEach(g=>{
      let div=document.createElement("div");
      div.className="giftItem";
      let span=document.createElement("span");
      span.textContent=`${g.name}: ${g.code}`;
      let btn=document.createElement("button");
      btn.textContent="📋";
      btn.onclick=()=>{
        navigator.clipboard.writeText(g.code);
        btn.textContent="✔";
        setTimeout(()=>btn.textContent="📋",1000);
      };
      div.appendChild(span); div.appendChild(btn);
      giftList.appendChild(div);
    });
  }

  /* UI */
  window.showPage = (p)=>{
    document.querySelectorAll(".page").forEach(x=>x.style.display="none");
    document.getElementById(p).style.display="block";
  };
});