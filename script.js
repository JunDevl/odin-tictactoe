const reset = document.querySelector(".reset");
const board = document.querySelector(".grid");

const player1 = document.querySelector(".player1");
const player2 = document.querySelector(".player2");

const player1Name = prompt("Please, inform the name of the first player:");
const player2Name = prompt("Okay, now inform the name of the second player:");

const blocks = document.querySelectorAll(".block");

const Game = (() => {
  function generatePlayer(sign, name) {
    return { sign, name, score: 0 };
  }

  let Player1 = generatePlayer("x", player1Name);
  let Player2 = generatePlayer("o", player2Name);

  let turn = "x";

  let gameboard = [];
  for (let i = 0;i < 9;i++) gameboard.push(null);

  player1.textContent = `${Player1.name} Score: `;
  const player1score = document.createElement("span");
  player1score.id = "score-p1";
  player1score.textContent = Player1.score;
  player1.appendChild(player1score);

  player2.textContent = `${Player2.name} Score: `;
  const player2score = document.createElement("span");
  player2score.id = "score-p2";
  player2score.textContent = Player2.score;
  player2.appendChild(player2score);

  function someoneDidScore() {
    let horizontalConcurrentSigns = "";
    for (let horizontal_i = 0;horizontal_i < 9;horizontal_i++) {
      if (horizontal_i < 3) {
        let verticalConcurrentSigns = "";
        const initialSign = gameboard[horizontal_i];
        for (let vertical_i = horizontal_i;vertical_i <= horizontal_i + 6;vertical_i += 3) {
          verticalConcurrentSigns = `${verticalConcurrentSigns}${gameboard[vertical_i]}`;
          if ((vertical_i / 6 === 1 || vertical_i / 7 === 1 || vertical_i / 8 === 1) &&
            initialSign &&
            verticalConcurrentSigns === `${initialSign}${initialSign}${initialSign}`)
            return Player1.sign === initialSign ? Player1.sign : Player2.sign;
        }
      }

      if (horizontal_i === 0) {
        let diagonalConcurrentSigns = "";
        const initialSign = gameboard[horizontal_i];
        for (let diagonal_i = horizontal_i;diagonal_i <= 8;diagonal_i += 4) {
          diagonalConcurrentSigns = `${diagonalConcurrentSigns}${gameboard[diagonal_i]}`;
          if (diagonal_i / 8 === 1 && initialSign && diagonalConcurrentSigns === `${initialSign}${initialSign}${initialSign}`)
            return Player1.sign === initialSign ? Player1.sign : Player2.sign;
        }
      }

      if (horizontal_i === 2) {
        let diagonalConcurrentSigns = "";
        const initialSign = gameboard[horizontal_i];
        for (let diagonal_i = horizontal_i;diagonal_i <= 6;diagonal_i += 2) {
          diagonalConcurrentSigns = `${diagonalConcurrentSigns}${gameboard[diagonal_i]}`;
          if (diagonal_i / 6 === 1 && initialSign && diagonalConcurrentSigns === `${initialSign}${initialSign}${initialSign}`)
            return Player1.sign === initialSign ? Player1.sign : Player2.sign;
        }
      }

      horizontalConcurrentSigns = `${horizontalConcurrentSigns}${gameboard[horizontal_i]}`;
      const initialSign = gameboard[horizontal_i - 2];
      if ((horizontal_i / 2 === 1 || horizontal_i / 5 === 1 || horizontal_i / 8 === 1) &&
        initialSign &&
        horizontalConcurrentSigns === `${initialSign}${initialSign}${initialSign}`)
        return Player1.sign === initialSign ? Player1.sign : Player2.sign;
    }
  }

  function getPlayerScore(playerSign) {
    return Player1.sign === playerSign ? Player1.score : Player2.score;
  }

  function increasePlayerScore(playerSign) {
    return Player1.sign === playerSign ? Player1.score++ : Player2.score++;
  }

  function updateGameboard(playerSign, blockElementID) {
    if (gameboard[+blockElementID - 1]) return;

    gameboard[+blockElementID - 1] = playerSign;

    turn = turn === "x" ? "o" : "x";
  }

  function someoneScored() {
    const playerScored = someoneDidScore();

    if (!playerScored) return false;

    increasePlayerScore(playerScored);

    player1score.textContent = Player1.score;
    player2score.textContent = Player2.score;

    gameboard = gameboard.map((item) => { return null; });

    return true;
  }

  function getCurrentTurn() {
    return turn;
  }

  function reset() {
    Player1.score = 0;
    Player2.score = 0;

    gameboard = gameboard.map((item) => { return null; });
  }

  return { getPlayerScore, increasePlayerScore, updateGameboard, someoneScored, getCurrentTurn, reset };
})();

const player1score = document.querySelector("#score-p1");
const player2score = document.querySelector("#score-p2");

board.addEventListener("click", (e) => {
  if (e.target.className !== "block") return;

  if (e.target.textContent !== "") return;

  e.target.textContent = Game.getCurrentTurn();

  Game.updateGameboard(e.target.textContent, e.target.id);

  if (Game.someoneScored()) blocks.forEach((elem) => elem.textContent = "");
});

reset.addEventListener("click", () => {
  Game.reset();
  blocks.forEach((elem) => elem.textContent = "");
});