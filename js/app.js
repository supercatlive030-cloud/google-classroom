// ---------- PAGE SWITCHING ----------
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// ---------- CALCULATOR UNLOCK ----------
let calcInput = "";

function press(n) {
  calcInput += n;
  document.getElementById("calcDisplay").textContent = calcInput;
}

function clearCalc() {
  calcInput = "";
  document.getElementById("calcDisplay").textContent = "0";
}

function checkCode() {
  // Ignore leading zeros
  if (parseInt(calcInput) === 2345) {
    document.getElementById("unlockMessage").textContent = "✔ Correct! Unlock Granted.";
  } else {
    document.getElementById("unlockMessage").textContent = "✖ Wrong Code.";
  }
}

// ---------- FAKE BROWSER ----------
function openFake(url) {
  document.getElementById("browserStatus").textContent = "Loading " + url + "...";
  setTimeout(() => {
    loadInBrowser(url);
  }, 500);
}

function loadInBrowser(url) {
  let browserWindow = document.getElementById("fakeBrowserWindow");
  browserWindow.innerHTML = "<iframe src=\"about:blank\" style=\"width:100%; height:100%; border:none;\"></iframe>";
  let iframe = browserWindow.querySelector("iframe");
  iframe.src = url;
  document.getElementById("browserStatus").textContent = "Loaded: " + url;
}

function goFake() {
  let url = document.getElementById("browserUrl").value.trim();
  if (!url) return;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  loadInBrowser(url);
}