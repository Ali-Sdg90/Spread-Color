const gameBox = document.getElementById("game-box");
let endLoop;
let gameSize = 5;
let delay = 100;
let maxLoopCounter = 10;
let spreadColor = "pink";
let Blockes;
function makeGround() {
    console.log(gameBox.textContent);
    for (let i = 0; i < gameSize * gameSize; i++) {
        const addBlock = document.createElement("div");
        // addBlock.textContent = i;
        gameBox.appendChild(addBlock);
    }
    gameBox.style.gridTemplateRows = `repeat(${gameSize},1fr)`;
    gameBox.style.gridTemplateColumns = `repeat(${gameSize},1fr)`;
    Blockes = Array.from(document.querySelectorAll("#game-box div"));
}
makeGround();
for (let i in Blockes) {
    Blockes[i].addEventListener("click", function () {
        Blockes[i].style.background = spreadColor;
        Blockes[i].style.border = "1px solid red";
        endLoop = false;
        wayFinder(i);
    });
}
let randomDirection;
function wayFinder(startPoint) {
    startPoint = Number(startPoint);
    randomDirection = Math.floor(Math.random() * 4);
    loopChecker(startPoint);
    if (endLoop) return;
    switch (randomDirection) {
        case 0: // left
            if (
                Blockes[startPoint - 1] &&
                startPoint % gameSize != 0 &&
                Blockes[startPoint - 1].style.background != spreadColor
            ) {
                console.log(startPoint, "left");
                setTimeout(() => {
                    wayFinder(startPoint - 1);
                    Blockes[startPoint - 1].style.background = spreadColor;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
        case 1: // right
            if (
                Blockes[startPoint + 1] &&
                (startPoint + 1) % gameSize != 0 &&
                Blockes[startPoint + 1].style.background != spreadColor
            ) {
                console.log(startPoint, "right");
                setTimeout(() => {
                    wayFinder(startPoint + 1);
                    Blockes[startPoint + 1].style.background = spreadColor;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
        case 2: // down
            if (
                Blockes[startPoint + gameSize] &&
                Blockes[startPoint + gameSize].style.background != spreadColor
            ) {
                console.log(startPoint, "down");
                setTimeout(() => {
                    wayFinder(startPoint + gameSize);
                    Blockes[startPoint + gameSize].style.background =
                        spreadColor;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
        case 3: // up
            if (
                Blockes[startPoint - gameSize] &&
                Blockes[startPoint - gameSize].style.background != spreadColor
            ) {
                console.log(startPoint, "up");
                setTimeout(() => {
                    wayFinder(startPoint - gameSize);
                    Blockes[startPoint - gameSize].style.background =
                        spreadColor;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
    }
}
let last20Moves = [];
for (let i = 0; i < maxLoopCounter; i++) {
    last20Moves[i] = null;
}
function loopChecker(randomDirection) {
    let loopCounter = 0;
    for (let i of last20Moves) {
        if (i == randomDirection) loopCounter++;
    }
    console.log(randomDirection, "=>", loopCounter, "/", maxLoopCounter);
    if (loopCounter == maxLoopCounter) {
        endLoop = true;
        console.log("END", maxLoopCounter, "for ", randomDirection);
    } else {
        last20Moves.shift();
        last20Moves.push(randomDirection);
        // console.log(last20Moves.join("."));
        endLoop = false;
    }
}
const ev = document.createEvent("MouseEvent");

for (let i = 0; i < 1; i++) {
    // Blockes[Math.floor(Math.random() * Math.pow(gameSize, 2))].click();
}
document.getElementById("apply").addEventListener("click", function () {
    gameSize = document.getElementById("game-size").value;
    // delay = document.getElementById("spread-speed").value;
    // spreadColor = document.getElementById("spread-color").value;
    // maxLoopCounter = document.getElementById("game-accuracy").value;
    makeGround();
    console.log(gameSize);
});
