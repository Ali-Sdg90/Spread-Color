const gameBox = document.getElementById("game-box");
let startBlock = "";
let wallBlock = [];
let endBlock = "";
for (let i = 0; i < 36; i++) {
    const addBlock = document.createElement("div");
    addBlock.textContent = i;
    gameBox.appendChild(addBlock);
}
const Blockes = Array.from(document.querySelectorAll("#game-box div"));

for (let i in Blockes) {
    Blockes[i].addEventListener("click", function () {
        // console.log(Blockes[i].textContent);
        if (!startBlock) {
            Blockes[i].style.background = "red";
            startBlock = i;
        } else if (wallBlock.length <= 5) {
            Blockes[i].style.background = "blue";
            wallBlock.push(i);
            console.log(wallBlock, wallBlock.length);
        } else if (!endBlock) {
            Blockes[i].style.background = "yellow";
            endBlock = i;
            setTimeout(() => {
                wayFinder();
            }, 500);
        }
    });
}
function wayFinder() {}
