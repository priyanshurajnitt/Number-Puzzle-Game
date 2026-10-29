const boardElement = document.getElementById("board");
const newGameButton = document.getElementById("new-game");
const messageElement = document.getElementById("message");
const movesElement = document.getElementById("moves");

let tiles = [];
let moves = 0;

// Return the position of the empty cell (represented by 0).
function getEmptyIndex() {
  return tiles.indexOf(0);
}

// Two cells are adjacent if they share an edge.
function areAdjacent(indexA, indexB) {
  const rowA = Math.floor(indexA / 4);
  const colA = indexA % 4;
  const rowB = Math.floor(indexB / 4);
  const colB = indexB % 4;

  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

// Shuffle by making legal moves from the solved board.
// This guarantees that the generated board is solvable.
function startNewGame() {
  tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

  let previousEmptyIndex = -1;
  const shuffleMoves = 200;

  for (let i = 0; i < shuffleMoves; i++) {
    const emptyIndex = getEmptyIndex();
    const possibleMoves = [];

    for (let i = 0; i < tiles.length; i++) {
      if (areAdjacent(i, emptyIndex) && i !== previousEmptyIndex) {
        possibleMoves.push(i);
      }
    }

    // If no alternative exists, allow any adjacent tile to move.
    const choices = possibleMoves.length > 0
      ? possibleMoves
      : tiles.map((_, index) => index).filter(index => areAdjacent(index, emptyIndex));

    const chosenIndex = choices[Math.floor(Math.random() * choices.length)];
    [tiles[emptyIndex], tiles[chosenIndex]] = [tiles[chosenIndex], tiles[emptyIndex]];
    previousEmptyIndex = emptyIndex;
  }

  // Avoid starting with an already-solved board.
  if (isSolved()) {
    startNewGame();
    return;
  }

  moves = 0;
  messageElement.textContent = "Good luck!";
  updateMoves();
  renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = "";

  tiles.forEach((number, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = number === 0 ? "tile empty" : "tile";
    tile.textContent = number === 0 ? "" : number;
    tile.setAttribute("aria-label", number === 0 ? "Empty space" : `Tile ${number}`);
    tile.disabled = number === 0;

    tile.addEventListener("click", () => moveTile(index));
    boardElement.appendChild(tile);
  });
}

function moveTile(index) {
  const emptyIndex = getEmptyIndex();

  if (!areAdjacent(index, emptyIndex)) {
    return;
  }

  [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
  moves++;
  updateMoves();
  renderBoard();

  if (isSolved()) {
    messageElement.textContent = `Puzzle solved! You did it in ${moves} moves.`;
  }
}

function isSolved() {
  for (let i = 0; i < 15; i++) {
    if (tiles[i] !== i + 1) {
      return false;
    }
  }

  return tiles[15] === 0;
}

function updateMoves() {
  movesElement.textContent = `Moves: ${moves}`;
}

newGameButton.addEventListener("click", startNewGame);

startNewGame();
