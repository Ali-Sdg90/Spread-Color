const gameBox = document.getElementById("game-box");
let endLoop;
let gameSize = 10;
let delay = 100;
let maxLoopCounter = 20;
let oneWayMethode = true;
let changeColor = true;
let showDebug = true;
let showNums = false;
let Blockes;
const backgroundColor = "rgb(49, 49, 49)";
document
    .querySelector(":root")
    .style.setProperty("--game-background", backgroundColor);
const hexChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
function colorChanger() {
    let hexSaver = "#";
    for (let i = 0; i < 6; i++) {
        hexSaver += hexChar[Math.floor(Math.random() * 16)];
    }
    spreadColorRGB = `rgb(${hexToRgb(hexSaver).join(", ")})`;
    return hexSaver;
}

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
spreadColorHEX = colorChanger();
document.getElementById("game-size").value = gameSize;
document.getElementById("spread-speed").value = delay;
document.getElementById("spread-color").value = spreadColorHEX;
document.getElementById("game-accuracy").value = maxLoopCounter;
if (changeColor) document.getElementById("change-color").checked = true;
else document.getElementById("change-color").checked = false;
if (showDebug) document.getElementById("show-debug").checked = true;
else document.getElementById("show-debug").checked = false;
if (showNums) document.getElementById("show-nums").checked = true;
else document.getElementById("show-nums").checked = false;
if (oneWayMethode) document.getElementById("spread-1-way").checked = true;
else document.getElementById("spread-1-way").checked = false;

function makeGround() {
    for (let i = 0; i < gameSize * gameSize; i++) {
        const addBlock = document.createElement("div");
        if (showNums) addBlock.textContent = i;
        gameBox.appendChild(addBlock);
    }
    gameBox.style.gridTemplateRows = `repeat(${gameSize},1fr)`;
    gameBox.style.gridTemplateColumns = `repeat(${gameSize},1fr)`;
    Blockes = Array.from(document.querySelectorAll("#game-box div"));
    Blockes.forEach(function (block) {
        block.style.background = backgroundColor;
    });
    for (let i in Blockes) {
        Blockes[i].addEventListener("click", function () {
            if (Blockes[i].style.background == backgroundColor) {
                if (changeColor) spreadColorHEX = colorChanger();
                Blockes[i].style.background = spreadColorRGB;
                Blockes[i].style.border = `0.25vh solid ${oppositeColor()}`;
                endLoop = false;
                wayFinder(i, spreadColorRGB);
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
function wayFinder(startPoint, blockColor) {
    startPoint = Number(startPoint);
    randomDirection = Math.floor(Math.random() * 4);
    loopChecker(startPoint);
    if (endLoop) return;
    switch (randomDirection) {
        case 0: // left
            if (
                Blockes[startPoint - 1] &&
                startPoint % gameSize != 0 &&
                Blockes[startPoint - 1].style.background == backgroundColor
            ) {
                console.log(startPoint, "left");
                setTimeout(() => {
                    wayFinder(startPoint - 1, blockColor);
                    Blockes[startPoint - 1].style.background = blockColor;
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
        case 1: // right
            if (
                Blockes[startPoint + 1] &&
                (startPoint + 1) % gameSize != 0 &&
                Blockes[startPoint + 1].style.background == backgroundColor
            ) {
                console.log(startPoint, "right");
                setTimeout(() => {
                    wayFinder(startPoint + 1, blockColor);
                    Blockes[startPoint + 1].style.background = blockColor;
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
        case 2: // down
            if (
                Blockes[startPoint + gameSize] &&
                Blockes[startPoint + gameSize].style.background ==
                    backgroundColor
            ) {
                console.log(startPoint, "down");
                setTimeout(() => {
                    wayFinder(startPoint + gameSize, blockColor);
                    Blockes[startPoint + gameSize].style.background =
                        blockColor;
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
        case 3: // up
            if (
                Blockes[startPoint - gameSize] &&
                Blockes[startPoint - gameSize].style.background ==
                    backgroundColor
            ) {
                console.log(startPoint, "up");
                setTimeout(() => {
                    wayFinder(startPoint - gameSize, blockColor);
                    Blockes[startPoint - gameSize].style.background =
                        blockColor;
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
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
        endLoop = false;
    }
}
// Blockes[Math.floor(Math.random() * Math.pow(gameSize, 2))].click();
document.getElementById("apply").addEventListener("click", function () {
    if (gameSize != Number(document.getElementById("game-size").value)) {
        gameBox.textContent = "";
        gameSize = Number(document.getElementById("game-size").value);
        makeGround();
    }
    delay = Number(document.getElementById("spread-speed").value);
    spreadColorHEX = document.getElementById("spread-color").value;
    maxLoopCounter = Number(document.getElementById("game-accuracy").value);
    if (document.getElementById("change-color").checked) {
        changeColor = true;
    } else {
        changeColor = false;
        spreadColorHEX = colorChanger();
        document.getElementById("spread-color").value = spreadColorHEX;
    }
    if (document.getElementById("show-debug").checked) {
        showDebug = true;
    } else {
        showDebug = false;
    }
    console.log(document.getElementById("show-nums").checked, showNums);
    if (document.getElementById("show-nums").checked != showNums) {
        gameBox.textContent = "";
        if (showNums) showNums = false;
        else showNums = true;
        makeGround();
    }
    if (document.getElementById("spread-1-way").checked) {
        oneWayMethode = true;
        document.getElementById("game-accuracy").style.PointerEvent = "auto";
        document.getElementById("game-accuracy").value = 20;
        document.getElementById("accuracy-form").style.pointerEvents = "auto";
        maxLoopCounter = 20;
    } else {
        oneWayMethode = false;
        document.getElementById("game-accuracy").value = 3;
        document.getElementById("accuracy-form").style.pointerEvents = "none";
        maxLoopCounter = 3;
    }
    createMaxLoopCounter();
    console.log("=========");
});
