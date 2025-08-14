
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
    startGame();
});

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