const COLORS = {
  '-1': 'blue',
  '1': 'red',
  '0': 'white',
};

const NUM_ROWS = 6;
const NUM_COLS = 7;

/*------- game start --------*/

let board, winner, turn, timer;

/*------- Dom Elements --------*/

const msgEl = document.getElementById('msg');
const markerEl = document.getElementById('markers');

/*-------  EVENT LISTENERS   -------*/

let cellEls = [];

for (let colI = 0; colI < NUM_COLS; colI++) {
  let tmp = [];
  for (let rowI = 0; rowI < NUM_ROWS; rowI++) {
    let el = document.getElementById(`c${colI}r${rowI}`);
    tmp.push(el);
  }
  cellEls.push(tmp);
}

markerEl.addEventListener('click', handleMarkerCLick);

init();

function handleMarkerCLick(evt) {
  // if (turn === -1) return;
  let el = evt.target;
  const colId = parseInt(el.getAttribute('id').replace('col', ''));

  if (isNaN(colId) || winner) return;

  let rowId = board[colId].indexOf(0);
  if (rowId === -1) return;

  board[colId][rowId] = turn;
  setWinner();
  turn = turn * -1;
  render();
}

function setWinner() {
  let foundZero = false;
  for (let colI = 0; colI < board.length; colI++) {
    for (let rowI = 0; rowI < board[colI].length; rowI++) {
      winner =
        checkUp(colI, rowI) ||
        checkRight(colI, rowI) ||
        checkDiag(colI, rowI, 1) ||
        checkDiag(colI, rowI, -1);
      if (winner) break;

      foundZero = foundZero || board[colI][rowI] === 0;
    }
    if (winner) break;
  }
  if (!winner && !foundZero) {
    winner = 'T';
  }
}

function checkUp(colIdx, rowIdx) {
  if (rowIdx > 2) return null;
  const colArr = board[colIdx];
  let absVal = Math.abs(
    colArr[rowIdx] + colArr[rowIdx + 1] + colArr[rowIdx + 2] + colArr[rowIdx + 3]
  );
  return absVal === 4 ? colArr[rowIdx][rowIdx] : null;
}

function checkRight(colIdx, rowIdx) {
  if (colIdx > 3) return null;
  let absVal = Math.abs(
    board[colIdx][rowIdx] +
      board[colIdx + 1][rowIdx] +
      board[colIdx + 2][rowIdx] +
      board[colIdx + 3][rowIdx]
  );
  return absVal === 4 ? board[colIdx][rowIdx] : null;
}

function checkDiag(colIdx, rowIdx, vertOffset) {
  if (colIdx > 3 || (vertOffset > 0 && rowIdx > 2) || (vertOffset < 0 && rowIdx < 3)) return;
  let absVal = Math.abs(
    board[colIdx][rowIdx] +
      board[colIdx + 1][rowIdx + vertOffset * 1] +
      board[colIdx + 2][rowIdx + vertOffset * 2] +
      board[colIdx + 3][rowIdx + vertOffset * 3]
  );
  return absVal === 4 ? board[colIdx][rowIdx] : null;
}

function render() {
  board.forEach((colArray, colI) => {
    const markerEl = document.getElementById(`col${colI}`);
    markerEl.style.borderTopColor = colArray.includes(0) ? 'grey' : 'brown';

    colArray.forEach((cell, rowI) => {
      let el = document.getElementById(`c${colI}r${rowI}`);
      el.style.backgroundColor = COLORS[cell];
    });
  });

  if (winner) {
    if (winner === 'T') {
      msgEl.textContent = "It's a tie!";
    } else {
      let color = COLORS[winner];
      msgEl.innerHTML = `<span style='color:${color}'>${color.toUpperCase()}</span> is the Winner!`;
    }
  } else {
    let color = COLORS[turn];
    msgEl.innerHTML = `<span style='color:${color}'>${color.toUpperCase()}'s</span> turn`;
  }
}

function init() {
  board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  winner = null;
  turn = 1;
  render();
}
