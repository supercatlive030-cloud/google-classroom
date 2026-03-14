const SITE_PASSWORD = btoa("012312")
const DEV_PASSWORD = "7995"

let attempts = 0
let allGames = []

document.addEventListener("DOMContentLoaded", () => {

const passwordInput = document.getElementById("sitePassword")

if(passwordInput){

passwordInput.addEventListener("keydown", e=>{
if(e.key === "Enter"){
checkSitePassword()
}
})

}

loadGames()
loadUpdates()
trackVisitors()
startParallax()

})