const gameBox = document.getElementById("game-box");
let startBlock = "";
let wallBlock = [];
let endBlock = "";
let backgroundColor = "rgb(49, 49, 49)";
document.documentElement.style.setProperty(
    "--game-background",
    backgroundColor
);
for (let i = 0; i < 36; i++) {
    const addBlock = document.createElement("div");
    addBlock.textContent = i;
    gameBox.appendChild(addBlock);
}
const Blockes = Array.from(document.querySelectorAll("#game-box div"));
for (let i in Blockes) {
    Blockes[i].addEventListener("click", function () {
        // console.log(Blockes[i].textContent);
        // if (!startBlock) {
        //     Blockes[i].style.background = "red";
        //     startBlock = i;
        // } else if (wallBlock.length <= 5) {
        //     Blockes[i].style.background = "blue";
        //     wallBlock.push(i);
        //     console.log(wallBlock, wallBlock.length);
        // } else if (!endBlock) {
        //     Blockes[i].style.background = "yellow";
        //     endBlock = i;
        //     setTimeout(() => {
        //         wayFinder(i);
        //     }, 500);
        // } else {
        //     wayFinder(i);
        // }
        Blockes[i].style.background = "pink";
        Blockes[i].style.border = "1px solid red";
        wayFinder(i);
    });
}
let randomDirection;
let endLoop = false;
const delay = 1000;
function wayFinder(startPoint) {
    startPoint = Number(startPoint);
    // console.log(startPoint, Blockes[startPoint].style.background);
    // Blockes[startPoint].style.background = "pink";
    randomDirection = Math.floor(Math.random() * 4);
    loopChecker(startPoint);
    if (endLoop) return;
    console.log(startPoint, randomDirection);
    switch (randomDirection) {
        case 0: // left
            if (
                Blockes[startPoint - 1] &&
                startPoint % 6 != 0 &&
                Blockes[startPoint - 1].style.background != "pink"
            ) {
                setTimeout(() => {
                    wayFinder(startPoint - 1);
                    Blockes[startPoint - 1].style.background = "pink";
                }, delay);
            } else {
                wayFinder(startPoint)
            }
            break;
        case 1: // right
            if (
                Blockes[startPoint + 1] &&
                (startPoint + 1) % 6 != 0 &&
                Blockes[startPoint + 1].style.background != "pink"
            ) {
                setTimeout(() => {
                    wayFinder(startPoint + 1);
                    Blockes[startPoint + 1].style.background = "pink";
                }, delay);
            } else {
                wayFinder(startPoint)
            }
            break;
        case 2: // down
            if (
                Blockes[startPoint + 6] &&
                Blockes[startPoint + 6].style.background != "pink"
            ) {
                setTimeout(() => {
                    wayFinder(startPoint + 6);
                    Blockes[startPoint + 6].style.background = "pink";
                }, delay);
            } else {
                wayFinder(startPoint)
            }
        case 3: // up
            if (
                Blockes[startPoint - 6] &&
                Blockes[startPoint - 6].style.background != "pink"
            ) {
                setTimeout(() => {
                    wayFinder(startPoint - 6);
                    Blockes[startPoint - 6].style.background = "pink";
                }, delay);
            } else {
                wayFinder(startPoint)
            }
            break
    }
}
let last5Moves = [36, 36, 36, 36, 36];
function loopChecker(randomDirection) {
    let loopCounter = 0;
    for (let i of last5Moves) {
        if (i == randomDirection) loopCounter++;
    }
    // console.log("loopCounter = ", loopCounter);
    if (loopCounter == 5) {
        endLoop = true;
        console.log("END 5 for ",randomDirection);
    } else {
        last5Moves.shift();
        last5Moves.push(randomDirection);
        console.log(last5Moves.join("."));
        endLoop = false;
    }
}
