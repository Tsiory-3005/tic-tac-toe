const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const timerText = document.getElementById("time");

const welcomeScreen = document.getElementById("welcome-screen");
const modeScreen = document.getElementById("mode-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const endMessage = document.getElementById("end-message");
const endDetail = document.getElementById("end-detail");


let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let modeDeJeu = "2players";
let timer;
let timeLeft = 20;

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

document.getElementById("start-btn").addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    modeScreen.style.display = "flex";
});

document.getElementById("mode-2players").addEventListener("click", () => {
    modeDeJeu = "2players";
    modeScreen.style.display = "none";
    gameScreen.style.display = "block";
    startGame();
});

document.getElementById("mode-bot").addEventListener("click", () => {
    modeDeJeu = "vsBot";
    modeScreen.style.display = "none";
    gameScreen.style.display = "block";
    startGame();
});

function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    statusText.textContent = `Joueur ${currentPlayer} à vous de jouer !`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.addEventListener("click", handleClick);
    });
    running = true;
    startTimer();
}

function handleClick() {
    const index = this.getAttribute("data-index");

    if (board[index] !== "" || !running) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;
    checkWinner();

    if (!running) return;

    switchPlayer();
    startTimer();

    if (modeDeJeu === "vsBot" && currentPlayer === "O") {
        setTimeout(botPlay, 500);
    }
}

function botPlay() {
    let empty = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
    if (empty.length === 0) return;

    let move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = currentPlayer;
    cells[move].textContent = currentPlayer;

    checkWinner();
    if (!running) return;

    switchPlayer();
    startTimer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Joueur ${currentPlayer} à vous de jouer !`;
}

function checkWinner() {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `🎉 Joueur ${currentPlayer} a gagné !`;
      running = false;
      clearInterval(timer);
      showEndScreen("Félicitations !", `Le joueur ${currentPlayer} a gagné 🎉`);
      return;
    }
  }

  if (!board.includes("")) {
    statusText.textContent = "Match nul !";
    running = false;
    clearInterval(timer);
    showEndScreen("Match nul !", "Personne n’a gagné 😅");
  }
}


function showEndScreen(message, detail) {
  gameScreen.style.display = "none";
  endScreen.style.display = "flex";
  endMessage.textContent = message;
  endDetail.textContent = detail;
}

function returnToMenu() {
  endScreen.style.display = "none";
  modeScreen.style.display = "flex";
}


function restartGame() {
  clearInterval(timer);
  endScreen.style.display = "none";
  gameScreen.style.display = "block";
  startGame();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 20;
    timerText.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            statusText.textContent = `⏳ Temps écoulé ! Tour perdu pour ${currentPlayer}`;
            switchPlayer();
            if (modeDeJeu === "vsBot" && currentPlayer === "O") {
                setTimeout(botPlay, 500);
            } else {
                startTimer();
            }
        }
    }, 1000);
}