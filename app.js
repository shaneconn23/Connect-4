/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

let makeBoard = () => {
    // set "board" to empty HEIGHT x WIDTH matrix array
    for (let y = 0; y < HEIGHT; y++) {
        board.push(Array.from({ length: WIDTH }));
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

let makeHtmlBoard = () => {
    // saving the htmlboard to a variable 
    const board = document.getElementById('board');

    // making the column tops for dropping in pieces
    const top = document.createElement("tr");
    // give this element an id of column top
    top.setAttribute("id", "column-top");
    // add event listener to make the top clickable 
    top.addEventListener("click", handleClick);

    // creates a td element for each column, give it an id of its column number.
    // append the td element to the top element we just created
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    // appends the top element to are board
    board.append(top);

    // creates a td for every square on the board and give it an id of its coordinates on
    // the board, 'x-y'.
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            // each td is appended to the appropriate row
            row.append(cell);
        }
        // then each row is appended to the board.
        board.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

let findSpotForCol = (x) => {
    // write the real version of this, rather than always returning 0
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (!board[y][x]) {
            return y;
        }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

let placeInTable = (y, x) => {
    // TODO: make a div and insert into correct table cell
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
}

/** endGame: announce game end */

let endGame = (message) => {
    //  pop up alert message
    alert(message);
}

/** handleClick: handle click of column top to play piece */

let handleClick = (HC) => {
    // get x from ID of clicked cell
    const x = +HC.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    // add line to update in-memory board
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`PLAYER${currPlayer} WINS!`);
    }


    //  check if all cells in board are filled; if so call, call endGame
    // check for tie
    if (board.every(row => row.every(cell => cell))) {
        return endGame('YOU TIED!');
    }
    // switch players

    currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

let checkForWin = () => {
    let _win = (cells) => {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            //destruct each element into a y and x number
            ([y, x]) =>
                //for every y,x pair, check to make sure it is inside our board and see if it belongs to the current player.
                y >= 0 &&
                y < HEIGHT &&
                x >= 0 &&
                x < WIDTH &&
                board[y][x] === currPlayer
        );
    }


    //   loop through every row
    for (let y = 0; y < HEIGHT; y++) {
        // loop through each square 
        for (let x = 0; x < WIDTH; x++) {
            // check for all the different ways to win
            const horizontal = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vertical = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagnol = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const antidiagnol = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
            //   check if any of our win conditions are true 
            if (_win(horizontal) || _win(vertical) || _win(diagnol) || _win(antidiagnol)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();