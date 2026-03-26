document.addEventListener("DOMContentLoaded", () => {

  // PAGE SWITCH
  window.showPage = function(p){
    document.querySelectorAll(".page").forEach(x => x.style.display="none");
    document.getElementById(p).style.display="block";
  };

  // CALCULATOR
  let calc="0";

  window.calcInput = function(v){
    if(calc.length > 20) return;
    calc = calc==="0" ? v : calc + v;
    document.getElementById("calcDisplay").value = calc;
  };

  window.calcClear = function(){
    calc="0";
    document.getElementById("calcDisplay").value = calc;
  };

  window.calcEnter = function(){
    const CODE="2312";

    if(calc===CODE){
      document.getElementById("calcLock").style.display="none";
      document.getElementById("loginScreen").style.display="flex";
      calcClear();
      return;
    }

    try{
      calc = eval(calc).toString();
    }catch{
      calc="Error";
    }

    document.getElementById("calcDisplay").value = calc;
  };

  // LOGIN
  document.getElementById("loginForm").addEventListener("submit", e=>{
    e.preventDefault();

    const pass=document.getElementById("sitePassword").value;

    if(pass==="012312"){
      document.getElementById("loginScreen").style.display="none";
      document.getElementById("siteContent").style.display="block";
      showPage("gamesPage");
      loadGames();
      loadChat();
      loadGifts();
    } else {
      document.getElementById("loginError").textContent="Wrong password";
    }
  });

  // CHAT
  window.sendChat = function(){
    const name=document.getElementById("chatName").value || "Anon";
    const msg=document.getElementById("chatMessage").value;
    if(!msg.trim()) return;

    let chats = JSON.parse(localStorage.getItem("chat") || "[]");
    chats.push(`${name}: ${msg}`);
    localStorage.setItem("chat", JSON.stringify(chats));

    document.getElementById("chatMessage").value="";
    loadChat();
  };

  window.loadChat = function(){
    const box=document.getElementById("chatBox");
    box.innerHTML="";
    let chats = JSON.parse(localStorage.getItem("chat") || "[]");

    chats.forEach(c=>{
      const p=document.createElement("p");
      p.textContent=c;
      box.appendChild(p);
    });
  };

  // GIFTS
  window.submitGift = function(){
    const name=document.getElementById("giftName").value || "Anon";
    const code=document.getElementById("giftCode").value;
    if(!code.trim()) return;

    let gifts = JSON.parse(localStorage.getItem("gifts") || "[]");
    gifts.push({name, code});
    localStorage.setItem("gifts", JSON.stringify(gifts));

    document.getElementById("giftName").value="";
    document.getElementById("giftCode").value="";
    loadGifts();
  };

  window.loadGifts = function(){
    const list=document.getElementById("giftList");
    list.innerHTML="";
    let gifts = JSON.parse(localStorage.getItem("gifts") || "[]");

    gifts.forEach(g=>{
      const div=document.createElement("div");
      div.className="giftItem";

      const span=document.createElement("span");
      span.textContent=`${g.name}: ${g.code}`;

      const btn=document.createElement("button");
      btn.textContent="📋";
      btn.onclick=()=>{
        navigator.clipboard.writeText(g.code)
          .catch(()=>alert("Copy failed"));
      };

      div.appendChild(span);
      div.appendChild(btn);
      list.appendChild(div);
    });
  };

  // GAMES
  let allGames=[];

  async function loadGames(){
    try{
      const res = await fetch("./games/games.json");
      allGames = await res.json();
      displayGames(allGames);
    }catch{
      document.getElementById("games").innerHTML="No games found.";
    }
  }

  function displayGames(games){
    const div=document.getElementById("games");
    div.innerHTML="";

    games.forEach(g=>{
      const d=document.createElement("div");
      d.className="game";
      d.innerHTML = `
        <h3>${g.title}</h3>
        <button onclick="startGame('${g.path}')">Play</button>
      `;
      div.appendChild(d);
    });
  }

  window.startGame = function(path){
    document.getElementById("player").innerHTML = `
      <div id="gameContainer">
        <button class="exitBtn" onclick="exitGame()">✖</button>
        <iframe src="${path}"></iframe>
      </div>
    `;
  };

  window.exitGame = function(){
    document.getElementById("player").innerHTML="<p>No game loaded.</p>";
  };

  window.searchGames = function(){
    const val=document.getElementById("gameSearch").value.toLowerCase();
    displayGames(allGames.filter(g=>g.title.toLowerCase().includes(val)));
  };

  window.randomGame = function(){
    if(!allGames.length) return;
    const g = allGames[Math.floor(Math.random()*allGames.length)];
    startGame(g.path);
  };

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape") exitGame();

    // PANIC KEY
    if(e.key==="\\"){
      window.location.href="https://www.google.com";
    }
  });

  // ABOUT:BLANK OPENER
  window.openSite = function(url){
    const win = window.open('about:blank', '_blank');

    if(!win){
      alert("Pop-up blocked! Allow pop-ups.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>Google Docs</title>
          <link rel="icon" href="https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png">
          <style>
            body { margin:0; }
            iframe {
              width:100vw;
              height:100vh;
              border:none;
            }
          </style>
        </head>
        <body>
          <iframe src="${url}" allowfullscreen></iframe>
        </body>
      </html>
    `);

    win.document.close();

    // SMART FALLBACK
    setTimeout(()=>{
      try{
        if(!win.document.body || win.document.body.innerHTML.length < 50){
          win.location.href = url;
        }
      }catch{
        win.location.href = url;
      }
    },1500);
  };

  // DEV TOOLS
  window.openByodLogin = function(){
    const el=document.getElementById("byodLogin");
    el.style.display="block";
    document.getElementById("byodPass").focus();
  };

  window.checkByodPass = function(){
    if(document.getElementById("byodPass").value==="6741"){
      document.getElementById("byodLogin").style.display="none";
      document.getElementById("byodPanel").style.display="block";
    } else {
      document.getElementById("byodError").textContent="Wrong password";
    }
  };

  window.launchByod = function(){
    window.open("https://your-username.github.io/learning-hub/", "_blank");
  };

});