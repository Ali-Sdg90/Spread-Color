const gameBox = document.getElementById("game-box");
let endLoop;
let gameSize = 10;
let delay = 100;
let maxLoopCounter = 20;
let oneWayMethode = true;
let changeColor = true;
let showDebug = true;
let showNums = false;
let showStartPoint = false;
let showRemaining = true;
let startPoints = [];
let blocks;
const backgroundColor = "rgb(49, 49, 49)";
document
    .querySelector(":root")
    .style.setProperty("--game-background", backgroundColor);

// Make HEX color, convert it to RGB and save it in spreadColorRGB and return HEX 
// values
const hexChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
function colorChanger() {
    const hexToRgb = (hex) =>
        hex
            .replace(
                /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                (m, r, g, b) => "#" + r + r + g + g + b + b
            )
            .substring(1)
            .match(/.{2}/g)
            .map((x) => parseInt(x, 16));
    let hexSaver = "#";
    for (let i = 0; i < 6; i++) {
        hexSaver += hexChar[Math.floor(Math.random() * 16)];
    }
    spreadColorRGB = `rgb(${hexToRgb(hexSaver).join(", ")})`;
    return hexSaver;
}

// Set default values and check checkmarks in setting
let spreadColorHEX = "#ffc0cb";
spreadColorHEX = colorChanger();
document.getElementById("game-size").value = gameSize;
document.getElementById("spread-speed").value = delay;
document.getElementById("spread-color").value = spreadColorHEX;
document.getElementById("game-accuracy").value = maxLoopCounter;
if (changeColor) document.getElementById("change-color").checked = true;
else document.getElementById("change-color").checked = false;
if (showStartPoint) document.getElementById("show-start-point").checked = true;
else document.getElementById("show-start-point").checked = false;
if (showDebug) document.getElementById("show-debug").checked = true;
else document.getElementById("show-debug").checked = false;
if (showNums) document.getElementById("show-nums").checked = true;
else document.getElementById("show-nums").checked = false;
if (oneWayMethode) document.getElementById("spread-1-way").checked = true;
else document.getElementById("spread-1-way").checked = false;
if (showRemaining) document.getElementById("show-remaining").checked = true;
else document.getElementById("show-remaining").checked = false;

// Create blocks in gameBox and set style for them
// Add addEventListener to blocks
// reset startPoints
function makeGround() {
    for (let i = 0; i < gameSize * gameSize; i++) {
        const addBlock = document.createElement("div");
        if (showNums) addBlock.textContent = i;
        gameBox.appendChild(addBlock);
    }
    gameBox.style.gridTemplateRows = `repeat(${gameSize},1fr)`;
    gameBox.style.gridTemplateColumns = `repeat(${gameSize},1fr)`;
    blocks = Array.from(document.querySelectorAll("#game-box div"));
    blocks.forEach(function (block) {
        block.style.background = backgroundColor;
    });
    startPoints = [];
    for (let i in blocks) {
        blocks[i].addEventListener("click", function () {
            if (blocks[i].style.border) {
                blocks[i].style.border = "none";
            }
            if (blocks[i].style.background == backgroundColor) {
                startPoints.push(i, oppositeColor());
                blocks[i].style.background = spreadColorRGB;
                if (showStartPoint) {
                    blocks[i].style.border = `0.25vh solid ${oppositeColor()}`;
                }
                endLoop = false;
                calcRemainig();
                wayFinder(i, spreadColorRGB);
                if (changeColor) spreadColorHEX = colorChanger();
                document.getElementById("spread-color").value = spreadColorHEX;
            }
        });
    }
}
makeGround();

// Return opposide color (RGB) for startPoints
function oppositeColor() {
    let rgbNums = spreadColorRGB.split(",");
    for (let i = 0; i < 3; i++) {
        rgbNums[i] = 255 - rgbNums[i].replace(/[^0-9]/g, "");
    }
    return `rgb(${rgbNums[0]} ,${rgbNums[1]} ,${rgbNums[2]})`;
}

// Calculate remaining blocks after every change in gameBox
// It has a lot of impact on the performance!
const remainingOutput = document.getElementById("remaining-blocks");
function calcRemainig() {
    if (showRemaining) {
        let remaining = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].style.background == backgroundColor) {
                ++remaining;
            }
        }
        remainingOutput.textContent = remaining;
    }
}
calcRemainig();
// The program chooses a random direction and if the conditions are right, it will go 
// to that block.
// Depending on the value of maxLoopCounter, it tries to go to new house.
// If the value of maxLoopCounter is 3, it means that each house will not move 3 times 
// if unable to go to the new block and end loop.
// In the random method, I did not allow changing the value of maxLoopCounter because 
// many calculation operations would be complicated and the performance of the program 
// would face problems.
// In random method, break in end of cases don't read and it can spread because every 
// way that can meet requirement calls wayFinder and like tree function grows
let randomDirection;
function wayFinder(startPoint, blockColor) {
    startPoint = Number(startPoint);
    randomDirection = Math.floor(Math.random() * 4);
    loopChecker(startPoint);
    if (endLoop) return;
    switch (randomDirection) {
        case 0: // left
            if (
                blocks[startPoint - 1] &&
                startPoint % gameSize != 0 &&
                blocks[startPoint - 1].style.background == backgroundColor
            ) {
                if (showDebug) console.log(startPoint, "left");
                setTimeout(() => {
                    wayFinder(startPoint - 1, blockColor);
                    blocks[startPoint - 1].style.background = blockColor;
                    calcRemainig();
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
        case 1: // right
            if (
                blocks[startPoint + 1] &&
                (startPoint + 1) % gameSize != 0 &&
                blocks[startPoint + 1].style.background == backgroundColor
            ) {
                if (showDebug) console.log(startPoint, "right");
                setTimeout(() => {
                    wayFinder(startPoint + 1, blockColor);
                    blocks[startPoint + 1].style.background = blockColor;
                    calcRemainig();
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
        case 2: // down
            if (
                blocks[startPoint + gameSize] &&
                blocks[startPoint + gameSize].style.background ==
                    backgroundColor
            ) {
                if (showDebug) console.log(startPoint, "down");
                setTimeout(() => {
                    wayFinder(startPoint + gameSize, blockColor);
                    blocks[startPoint + gameSize].style.background = blockColor;
                    calcRemainig();
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
        case 3: // up
            if (
                blocks[startPoint - gameSize] &&
                blocks[startPoint - gameSize].style.background ==
                    backgroundColor
            ) {
                if (showDebug) console.log(startPoint, "up");
                setTimeout(() => {
                    wayFinder(startPoint - gameSize, blockColor);
                    blocks[startPoint - gameSize].style.background = blockColor;
                    calcRemainig();
                }, delay);
            } else {
                wayFinder(startPoint, blockColor);
            }
            if (oneWayMethode) break;
    }
}

// LastMovesArray store moves and use it in loopChecker
// The function is executed in the first run and with the apply button
let lastMovesArray = [];
function createMaxLoopCounter() {
    for (let i = 0; i < maxLoopCounter; i++) {
        lastMovesArray[i] = null;
    }
}
createMaxLoopCounter();

// Check if block can't move anywhere and stuck in loop
// Its accuracy depends on maxLoopCounter
function loopChecker(randomDirection) {
    let loopCounter = 0;
    for (let i of lastMovesArray) {
        if (i == randomDirection) loopCounter++;
    }
    if (showDebug)
        console.log(randomDirection, "=>", loopCounter, "/", maxLoopCounter);
    if (loopCounter == maxLoopCounter) {
        endLoop = true;
        if (showDebug)
            console.log("End", maxLoopCounter, "for ", randomDirection);
    } else {
        lastMovesArray.shift();
        lastMovesArray.push(randomDirection);
        endLoop = false;
    }
}

//For game-size spread-speed game-accuracy check input
function inputChecker(inputValue, min, max, defaultValue) {
    if (inputValue >= min && inputValue <= max && !isNaN(inputValue)) {
        return inputValue;
    } else {
        if (showDebug) console.log("-- Wrong input! --");
        return defaultValue;
    }
}
document.getElementById("game-size").addEventListener("focusout", function () {
    document.getElementById("game-size").value = inputChecker(
        document.getElementById("game-size").value,
        1,
        150,
        10
    );
});
document
    .getElementById("spread-speed")
    .addEventListener("focusout", function () {
        document.getElementById("spread-speed").value = inputChecker(
            document.getElementById("spread-speed").value,
            0,
            2000,
            100
        );
    });
document
    .getElementById("game-accuracy")
    .addEventListener("focusout", function () {
        document.getElementById("game-accuracy").vgameBoxalue = inputChecker(
            document.getElementById("game-accuracy").value,
            2,
            100,
            20
        );
    });

// Apply setting button
document.getElementById("apply").addEventListener("click", function () {
    if (gameSize != Number(document.getElementById("game-size").value)) {
        gameBox.textContent = "";
        gameSize = Number(document.getElementById("game-size").value);
        makeGround();
        calcRemainig();
    }
    delay = Number(document.getElementById("spread-speed").value);
    spreadColorHEX = document.getElementById("spread-color").value;
    const hexToRgb = (hex) =>
        hex
            .replace(
                /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                (m, r, g, b) => "#" + r + r + g + g + b + b
            )
            .substring(1)
            .match(/.{2}/g)
            .map((x) => parseInt(x, 16));
    spreadColorRGB = `rgb(${hexToRgb(spreadColorHEX).join(", ")})`;
    maxLoopCounter = Number(document.getElementById("game-accuracy").value);
    if (document.getElementById("change-color").checked) {
        changeColor = true;
    } else {
        changeColor = false;
        spreadColorHEX = colorChanger();
        document.getElementById("spread-color").value = spreadColorHEX;
    }
    if (document.getElementById("show-start-point").checked) {
        for (let i = 0; i < startPoints.length; i = i + 2) {
            blocks[startPoints[i]].style.border = `0.25vh solid ${
                startPoints[i + 1]
            }`;
        }
        showStartPoint = true;
    } else {
        blocks.forEach(function (block) {
            if (block.style.border) {
                block.style.border = "none";
            }
        });
        showStartPoint = false;
    }
    if (document.getElementById("show-debug").checked) {
        showDebug = true;
    } else {
        showDebug = false;
    }
    if (document.getElementById("show-nums").checked != showNums) {
        gameBox.textContent = "";
        if (showNums) showNums = false;
        else showNums = true;
        makeGround();
    }
    if (document.getElementById("spread-1-way").checked) {
        oneWayMethode = true;
        document.getElementById("accuracy-form").style.pointerEvents = "auto";
    } else {
        oneWayMethode = false;
        document.getElementById("game-accuracy").value = 3;
        document.getElementById("accuracy-form").style.pointerEvents = "none";
        maxLoopCounter = 3;
    }
    if (document.getElementById("show-remaining").checked) {
        showRemaining = true;
        document.getElementById("all-blocks").textContent = gameSize * gameSize;
    } else {
        document.getElementById("all-blocks").textContent = "-";
        document.getElementById("remaining-blocks").textContent = "-";
        showRemaining = false;
    }
    createMaxLoopCounter();
});

// Click on reload button to reset gameBox
document.getElementById("reload").addEventListener("click", function () {
    gameBox.textContent = "";
    makeGround();
    calcRemainig();
});

// Double click on reload button to reload page
document.getElementById("reload").addEventListener("dblclick", function () {
    location.reload();
});

// Click on Random start point and simulate click on proper block
document.getElementById("random-point").addEventListener("click", function () {
    let randNum = Math.floor(Math.random() * Math.pow(gameSize, 2));
    let availableblocks = 0;
    blocks.forEach(function (block) {
        if (block.style.background == backgroundColor) {
            availableblocks++;
        }
    });
    while (blocks[randNum].style.background != backgroundColor) {
        if (availableblocks == 0) break;
        randNum = Math.floor(Math.random() * Math.pow(gameSize, 2));
    }
    blocks[randNum].click();
});
