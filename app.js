
let clickSound = new Audio("music/click.wav");
let gameOverSound = new Audio("music/gameover2.wav");

let gameSequence = [];
let userSequence = [];
let started = false;
let level = 0;
let btns = ["yellow", "blue", "pink", "red"];

document.addEventListener("keypress", startGame);
document.querySelector(".start").addEventListener("click", startGame);

function startGame() {
    if (!started) {
        started = true;
        level = 0;
        gameSequence = [];
        userSequence = [];
        document.querySelector("h3").innerText = "Level 0";
        levelUp();
    }
}

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(() => btn.classList.remove("userFlash"), 300);
}

function levelUp() {
    userSequence = [];
    level++;
    document.querySelector("h3").innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`#${randColor}`);

    gameSequence.push(randColor);
    gameFlash(randBtn);
    console.log("Game sequence:", gameSequence);
}

function btnPress() {
    let clickSound = new Audio("music/click.wav"); // create fresh sound
    clickSound.play();

    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userSequence.push(userColor);
    checkAns(userSequence.length - 1);
}


let allBtns = document.querySelectorAll(".btn");
allBtns.forEach(btn => btn.addEventListener("click", btnPress));

function checkAns(idx) {
    if (userSequence[idx] === gameSequence[idx]) {
        if (userSequence.length === gameSequence.length) {
            setTimeout(levelUp, 800);
        }
    } else {
        showGameOver();
    }
}

function showGameOver() {
    gameOverSound.play();
    document.querySelector("#finalScore").innerText = `Your Score: ${level - 1}`;
    document.querySelector("#gameOverModal").style.display = "flex";
}

document.querySelector("#restartBtn").addEventListener("click", () => {
    document.querySelector("#gameOverModal").style.display = "none";
    started = false; // reset started flag
    startGame();
});

//addd
let playerName = "";
let highScores = JSON.parse(localStorage.getItem("simonLeaderboard")) || [];

// Show login modal until name is entered
document.querySelector("#startGameBtn").addEventListener("click", () => {
    const nameInput = document.querySelector("#playerNameInput").value.trim();
    if (nameInput) {
        playerName = nameInput;
        document.querySelector("#playerNameDisplay").innerText = `Player: ${playerName}`;
        document.querySelector("#loginScreen").style.display = "none";
    }
});

// Update Game Over to show name & save score
function showGameOver() {
    gameOverSound.play();
    document.querySelector("#finalScore").innerText = `${playerName}, Your Score: ${level - 1}`;
    
    // Save to leaderboard
    highScores.push({ name: playerName, score: level - 1 });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5); // keep top 5
    localStorage.setItem("simonLeaderboard", JSON.stringify(highScores));

    document.querySelector("#gameOverModal").style.display = "flex";
}

// Leaderboard button click
document.querySelector("#leaderboardBtn").addEventListener("click", () => {
    const list = document.querySelector("#leaderboardList");
    list.innerHTML = "";
    highScores.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name} - ${entry.score}`;
        list.appendChild(li);
    });
    document.querySelector("#leaderboardModal").style.display = "flex";
});

// Close leaderboard
document.querySelector("#closeLeaderboard").addEventListener("click", () => {
    document.querySelector("#leaderboardModal").style.display = "none";
});


/* ---------- LOGIN + NAME PERSIST + SAFE START ---------- */

// Try to grab elements if you added them
const loginScreen   = document.querySelector("#loginScreen");
const gameContainer = document.querySelector("#gameContainer");
const nameInput     = document.querySelector("#playerNameInput") || document.querySelector("#playerName");
const startGameBtn  = document.querySelector("#startGameBtn");
const nameDisplay   = document.querySelector("#playerNameDisplay");

// Keep/restore player name from localStorage
 playerName = localStorage.getItem("playerName") || "";

// Helper to set & show name everywhere
function setPlayerName(name) {
  playerName = name.trim() || "Player";
  localStorage.setItem("playerName", playerName);
  if (nameDisplay) nameDisplay.innerText = `Player: ${playerName}`;
}

// 1) Block starting the game until login is completed
//    (remove the listeners your script added earlier)
document.removeEventListener("keypress", startGame);
const startH3 = document.querySelector(".start");
if (startH3) startH3.removeEventListener("click", startGame);

// 2) If name already saved, skip login immediately
if (playerName) {
  setPlayerName(playerName);
  if (loginScreen) loginScreen.style.display = "none";
  if (gameContainer) gameContainer.style.display = "block";

  // re-enable starting once login is complete
  document.addEventListener("keypress", startGame);
  if (startH3) startH3.addEventListener("click", startGame);
}

// 3) Handle login button
if (startGameBtn) {
  startGameBtn.addEventListener("click", () => {
    const val = nameInput ? nameInput.value : "";
    if (!val || !val.trim()) return;
    setPlayerName(val);
    if (loginScreen) loginScreen.style.display = "none";
    if (gameContainer) gameContainer.style.display = "block";

    // re-enable starting after login
    document.addEventListener("keypress", startGame);
    if (startH3) startH3.addEventListener("click", startGame);
  });
}

// 4) Let Enter key submit the name (common cause of “not starting”)
if (nameInput) {
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && startGameBtn) startGameBtn.click();
  });
}

/* ---------- SHOW NAME ON GAME OVER + LOCAL LEADERBOARD ---------- */

// Wrap your existing showGameOver to append name + save high score
if (typeof showGameOver === "function") {
  const _showGameOver = showGameOver;
  showGameOver = function () {
    _showGameOver(); // call your original function first

    // Ensure name label is visible/updated
    if (nameDisplay) nameDisplay.innerText = `Player: ${playerName || localStorage.getItem("playerName") || "Player"}`;

    // Prepend player's name on the score line
    const fs = document.querySelector("#finalScore");
    const currentLabel = fs ? fs.innerText : "";
    const who = playerName || localStorage.getItem("playerName") || "Player";
    if (fs && !currentLabel.startsWith(who)) {
      fs.innerText = `${who}, ${currentLabel}`;
    }

    // Save to a simple local leaderboard (top 5)
    const score = (typeof level === "number" ? level - 1 : 0) | 0;
    let board = JSON.parse(localStorage.getItem("simonLeaderboard") || "[]");
    board.push({ name: who, score });
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 5);
    localStorage.setItem("simonLeaderboard", JSON.stringify(board));
  };
}

// Optional: wire leaderboard button if you added it
const leaderboardBtn = document.querySelector("#leaderboardBtn");
const leaderboardModal = document.querySelector("#leaderboardModal");
const leaderboardList = document.querySelector("#leaderboardList");
const closeLeaderboard = document.querySelector("#closeLeaderboard");

if (leaderboardBtn && leaderboardModal && leaderboardList && closeLeaderboard) {
  leaderboardBtn.addEventListener("click", () => {
    const board = JSON.parse(localStorage.getItem("simonLeaderboard") || "[]");
    leaderboardList.innerHTML = "";
    board.forEach((entry, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i + 1} ${entry.name} — ${entry.score}`;
      leaderboardList.appendChild(li);
    });
    leaderboardModal.style.display = "flex";
  });

  closeLeaderboard.addEventListener("click", () => {
    leaderboardModal.style.display = "none";
  });
}


// let gameSequence= []
// let userSequence=[]
// let started = false
// let level = 0;
// let btns=["yellow","blue","pink","red"]
// document.addEventListener("keypress",() => {
//     if(started==false){
//         console.log("started")
//         started=true
//         levelUp();
//     }
//   }
// )

// function gameFlash(btn){
//     btn.classList.add("flash")
//     setTimeout(() => {
//         btn.classList.remove("flash")
//     }, 250);
// }

// function userFlash(btn){
//     btn.classList.add("userFlash")
//     setTimeout(() => {
//         btn.classList.remove("userFlash")
//     }, 250);
// }

// function levelUp(){
//     userSequence=[];
//     level++;
//     let randInx=Math.floor(Math.random()*3)
//     let randColor= btns[randInx];
//     let randBtn=document.querySelector(`.${randColor}`)
//     document.querySelector("h3").innerText=`level ${level}`
//     gameFlash(randBtn);
    
//     gameSequence.push(randColor)
//     console.log(gameSequence)

// }

// function btnPress(){
//     console.log("pressed me")
//     let btn =this
//     userFlash(btn)
//     userColor= btn.getAttribute("id")
//  userSequence.push(userColor)
//  checkAns(userSequence.length-1)
// }

// let allBtns =document.querySelectorAll(".btn")
// for(btn of allBtns){
//     btn.addEventListener("click",btnPress)
// }

// function checkAns(idx){
//     // console.log(`currenbt ${ level}`)
    
//     if(userSequence[idx]===gameSequence[idx])
//     {
//         if(userSequence.length==gameSequence.length){
//             setTimeout(levelUp, 1000);
            
//         }
//     }else{
//         document.querySelector("h3").innerText=` GAME OVER BOLTEEEEE`
//         document.querySelector("body").style.backgroundColor="red";
// setTimeout(function(){
//          document.querySelector("body").style.backgroundColor="blueviolet";
// },150)
//         reset()
//     }
// }
// function reset(){
//     level =0;
//     started=false;
//     gameSequence=[]
//     userSequence=[]

// }