const gameBox = document.getElementById("game-box");
let endLoop;
let gameSize = 5;
let delay = 100;
let maxLoopCounter = 10;
let Blockes;

const hexToRgb = (hex) =>
    hex
        .replace(
            /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
            (m, r, g, b) => "#" + r + r + g + g + b + b
        )
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));

let spreadColorHEX = "#ffc0cb";
let spreadColorRGB = `rgb(${hexToRgb(spreadColorHEX).join(", ")})`;
document.getElementById("game-size").value = gameSize;
document.getElementById("spread-speed").value = delay;
document.getElementById("spread-color").value = spreadColorHEX;
document.getElementById("game-accuracy").value = maxLoopCounter;

function makeGround() {
    for (let i = 0; i < gameSize * gameSize; i++) {
        const addBlock = document.createElement("div");
        // addBlock.textContent = i;
        gameBox.appendChild(addBlock);
    }
    gameBox.style.gridTemplateRows = `repeat(${gameSize},1fr)`;
    gameBox.style.gridTemplateColumns = `repeat(${gameSize},1fr)`;
    Blockes = Array.from(document.querySelectorAll("#game-box div"));
    for (let i in Blockes) {
        Blockes[i].addEventListener("click", function () {
            if (Blockes[i].style.background != spreadColorRGB) {
                Blockes[i].style.background = spreadColorRGB;
                Blockes[i].style.border = `0.25vh solid ${oppositeColor()}`;
                endLoop = false;
                wayFinder(i);
            }
        });
    }
}
makeGround();

function oppositeColor() {
    let rgbNums = spreadColorRGB.split(",");
    for (let i = 0; i < 3; i++) {
        rgbNums[i] = 255 - rgbNums[i].replace(/[^0-9]/g, "");
    }
    return `rgb(${rgbNums[0]} ,${rgbNums[1]} ,${rgbNums[2]})`;
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
                Blockes[startPoint - 1].style.background != spreadColorRGB
            ) {
                console.log(startPoint, "left");
                setTimeout(() => {
                    wayFinder(startPoint - 1);
                    Blockes[startPoint - 1].style.background = spreadColorRGB;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
        case 1: // right
            if (
                Blockes[startPoint + 1] &&
                (startPoint + 1) % gameSize != 0 &&
                Blockes[startPoint + 1].style.background != spreadColorRGB
            ) {
                console.log(startPoint, "right");
                setTimeout(() => {
                    wayFinder(startPoint + 1);
                    Blockes[startPoint + 1].style.background = spreadColorRGB;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
        case 2: // down
            if (
                Blockes[startPoint + gameSize] &&
                Blockes[startPoint + gameSize].style.background !=
                    spreadColorRGB
            ) {
                console.log(startPoint, "down");
                setTimeout(() => {
                    wayFinder(startPoint + gameSize);
                    Blockes[startPoint + gameSize].style.background =
                        spreadColorRGB;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
        case 3: // up
            if (
                Blockes[startPoint - gameSize] &&
                Blockes[startPoint - gameSize].style.background !=
                    spreadColorRGB
            ) {
                console.log(startPoint, "up");
                setTimeout(() => {
                    wayFinder(startPoint - gameSize);
                    Blockes[startPoint - gameSize].style.background =
                        spreadColorRGB;
                }, delay);
            } else {
                wayFinder(startPoint);
            }
            break;
    }
}
let last20Moves = [];
function createMaxLoopCounter() {
    for (let i = 0; i < maxLoopCounter; i++) {
        last20Moves[i] = null;
    }
}
createMaxLoopCounter();
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
// Blockes[Math.floor(Math.random() * Math.pow(gameSize, 2))].click();
document.getElementById("apply").addEventListener("click", function () {
    console.log(Blockes.length);
    console.log(typeof gameSize, gameSize);
    console.log(typeof delay, delay);
    console.log(typeof spreadColorRGB, spreadColorRGB);
    console.log(typeof spreadColorHEX, spreadColorHEX);
    console.log(typeof maxLoopCounter, maxLoopCounter);
    gameSize = Number(document.getElementById("game-size").value);
    delay = Number(document.getElementById("spread-speed").value);
    spreadColorHEX = document.getElementById("spread-color").value;
    spreadColorRGB = `rgb(${hexToRgb(spreadColorHEX).join(", ")})`;
    maxLoopCounter = Number(document.getElementById("game-accuracy").value);
    gameBox.textContent = "";
    makeGround();
    createMaxLoopCounter();
    console.log("=========");
    console.log(Blockes.length);
    console.log(typeof gameSize, gameSize);
    console.log(typeof delay, delay);
    console.log(typeof spreadColorRGB, spreadColorRGB);
    console.log(typeof spreadColorHEX, spreadColorHEX);
    console.log(typeof maxLoopCounter, maxLoopCounter);
});
