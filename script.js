function Gameboard() {
    let board = [];
    const rows = 3;
    const columns = 3;


    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
        
    }

    const getBoard = () => board;
    
    const placeMark = (row, column, move) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].setValue(move);
            return true;
        } else {
            return false;
        }
    }

    const printBoard = () => {
        const boardWithValues = board.map((row) => 
        row.map((cell) => cell.getValue())
        );
        console.log(boardWithValues);

        return {boardWithValues}
    }

    return {getBoard, placeMark, printBoard}
  
}

function Cell() {
    let value = 0;

    const setValue = (move) => 
        {value = move};

    const getValue = () => value;

    return {setValue, getValue};
}

function GameController() {
    const playerOneName = "Player One";
    const playerTwoName = "Player Two";
    
    let gameOver = false;

    let board = Gameboard();
    const boardArray = () => board.getBoard();
    const getBoard = () => board.getBoard();

    const isGameOver = () => gameOver;

    const players = [
        {
            name: playerOneName,
            move: "X",
        },
        {
            name: playerTwoName,
            move: "O",
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1]: players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = () => {
        const board = boardArray();

        const checkRowWin = () => {
            for (let i = 0; i < 3; i++) {
                const first = board[i][0].getValue();

                if (first === 0) continue;

                if (
                    board[i][1].getValue() === first &&
                    board[i][2].getValue() === first
                ) {
                    return true;
                } 
            } return false;
        }

        const checkColumnWin = () => {
            for (let i = 0; i < 3; i++) {
                const first = board[0][i].getValue();

                if (first === 0) continue;

                if (
                    board[1][i].getValue() === first &&
                    board[2][i].getValue() === first
                ) {
                    return true;
                } 

            } return false;
        }

        const checkDiagonalWin = () => {
            const center = board[1][1].getValue();
            if (center === 0) return false;

            if (board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue()) {
                return true;
            } else if (board[0][2].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][0].getValue()) {
                return true;
            } else {
                return false;
            } 
        } 

        if (checkColumnWin() || checkRowWin() || checkDiagonalWin()) {
            return true;
        }

        return false;
    };

    const clearBoard = () => {
        boardArray().forEach(row => {
            row.forEach(cell => {
                cell.setValue(0);
            })
        })
        activePlayer = players[0];
        gameOver = false;
    }

    const playRound = (row, column) => {
        if (gameOver) {
            console.log("Game is over. Reset to play again.");
            return;
        }

        console.log(`Placed ${getActivePlayer().name}'s move into into row ${row} and column ${column}`);
        
        if (board.placeMark(row, column, getActivePlayer().move)) {
            if (checkWinner()) {
                printNewRound();
                console.log(`${getActivePlayer().name} won!!`);
                const winDiv = document.querySelector(".win");
                winDiv.innerHTML = `${getActivePlayer().name} won!!`;

                gameOver = true;
                return;
            }
            switchPlayerTurn();
            printNewRound();
        } 
        
    };

    printNewRound();

    const resetGame = () => {
        board = Gameboard(); 
        activePlayer = players[0];
        gameOver = false;

        printNewRound();
    };

    return {getBoard, getActivePlayer, playRound, resetGame, isGameOver};

}


function ScreenController () {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = 
                    cell.getValue() === 0 ? "" : cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    };

    const clickHandlerBoard = (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedColumn) return;

        game.playRound(
            Number(selectedRow),
            Number(selectedColumn)
        );

        updateScreen();
    };
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();

}

ScreenController();
