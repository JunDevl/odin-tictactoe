const reset = document.querySelector(".reset");
const board = document.querySelector(".grid");

const winner = document.querySelector(".winner");
const playAgain = document.querySelector("#play-again");

const Game = (() => {
  function generatePlayer(sign, name) {
    return { sign, name, score: 0 };
  }

  let Player1 = {};
  let Player2 = {};

  let turn = "x";

  let winner = "";

  let gameboard = [];

  function init() {
    let player1Name = prompt("Please, inform the name of the first player:");
    while (!player1Name) player1Name = prompt(`Filling in your name is mandatory.`);

    let player2Name = prompt("Okay, now inform the name of the second player:");
    while (!player1Name) player2Name = prompt(`Filling in your name is mandatory.`);

    Player1 = generatePlayer("x", player1Name);
    Player2 = generatePlayer("o", player2Name);

    player1Element.textContent = `${Player1.name} Score: `;
    const player1score = document.createElement("span");
    player1score.id = "score-p1";
    player1score.textContent = Player1.score;
    player1Element.appendChild(player1score);

    player2Element.textContent = `${Player2.name} Score: `;
    const player2score = document.createElement("span");
    player2score.id = "score-p2";
    player2score.textContent = Player2.score;
    player2Element.appendChild(player2score);
  }

  const blocks = document.querySelectorAll(".block");

  const player1Element = document.querySelector(".player1");
  const player2Element = document.querySelector(".player2");

  init();

  for (let i = 0;i < gameboard.length;i++) gameboard.push(null);

  function someoneDidScore() {
    let signChecker = "";

    function checkPlayer(sign) {
      return Player1.sign === sign ? Player1 : Player2;
    }

    function loopLogic(i) {
      if (signChecker.includes(`${Player1.sign}${Player1.sign}${Player1.sign}`) || signChecker.includes(`${Player2.sign}${Player2.sign}${Player2.sign}`))
        return signChecker[0];

      if (signChecker.length >= 3) signChecker = "";
      if (gameboard[i] !== 0 || gameboard[i] !== null) signChecker += gameboard[i];
    };

    // Horizontal Grid Check
    for (let i = 0;i < gameboard.length;i++) {
      const text = loopLogic(i);
      if (text !== undefined) return checkPlayer(text);
    }

    // Vertical Grid Check
    for (let i = 0;i <= 2;i++) {
      let text = loopLogic(i);
      if (text !== undefined) return checkPlayer(text);
      for (let j = 3 + i;j <= 6 + i;j += 3) {
        text = loopLogic(j);
        if (text !== undefined) return checkPlayer(text);
      }
    }

    // Top-left Diagonal Grid Check
    for (let i = 0;i <= 8;i += 4) {
      const text = loopLogic(i);
      if (text !== undefined) return checkPlayer(text);
    }

    // Top-right Diagonal Grid Check
    for (let i = 2;i <= 6;i += 2) {
      const text = loopLogic(i);
      if (text !== undefined) return checkPlayer(text);
    }
  }

  function updateGameboard(blockElementID) {
    if (gameboard[+blockElementID - 1]) return;

    gameboard[+blockElementID - 1] = turn;

    turn = turn === "x" ? "o" : "x";
  }

  function someoneScored() {
    const playerScored = someoneDidScore();

    if (!playerScored) return false;

    playerScored.score++;

    player1score.textContent = Player1.score;
    player2score.textContent = Player2.score;

    gameboard = gameboard.map((item) => { return null; });
    winner = playerScored.name;

    return true;
  }

  function getCurrentSignTurn() {
    return turn;
  }

  function getWinner() {
    return winner;
  }

  function resetSet() {
    winner = "";
    gameboard = gameboard.map((item) => { return null; });
    blocks.forEach((elem) => elem.textContent = "");
  }

  function resetAll() {
    Player1.score = 0;
    Player2.score = 0;

    player1score.textContent = Player1.score;
    player2score.textContent = Player2.score;

    winner = "";
    gameboard = gameboard.map((item) => { return null; });
    blocks.forEach((elem) => elem.textContent = "");
  }

  return { updateGameboard, someoneScored, getCurrentSignTurn, getWinner, resetSet, resetAll };
})();

const player1score = document.querySelector("#score-p1");
const player2score = document.querySelector("#score-p2");

board.addEventListener("click", (e) => {
  if (e.target.className !== "block" || e.target.textContent !== "" || Game.getWinner()) return;

  e.target.innerHTML = Game.getCurrentSignTurn() === "x" ? "<span>&times;<span/>" : "<span>&cir;<span/>";

  Game.updateGameboard(e.target.id);

  if (Game.someoneScored()) {
    winner.style.display = "block";
    playAgain.style.display = "block";

    winner.firstElementChild.textContent = Game.getWinner();
  };
});

playAgain.addEventListener("click", () => {
  Game.resetSet();

  winner.style.display = "none";
  playAgain.style.display = "none";

  winner.firstElementChild.textContent = "";
});

reset.addEventListener("click", () => {
  Game.resetAll();

  winner.style.display = "none";
  playAgain.style.display = "none";

  winner.firstElementChild.textContent = "";
});