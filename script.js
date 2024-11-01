// Select necessary elements
let resetButton = document.querySelector('#resetButton');
let cells = document.querySelectorAll('.cell');
let status = document.querySelector('#status');
let status2 = document.querySelector('#status2');
const PCS = document.getElementById("playerChoiceScreen");
const game = document.getElementById("container");
const final = document.getElementById("congratulationsScreen");
const choiceModal = document.getElementById("choiceModal");

let playerSymbol = "X";
let computerSymbol = "O";
let friendSymbol = "O";
let isPlayerTurn = true;
let gameActive = true;
const winSound = new Audio("win-sound.mp3");
const drawSound = new Audio("draw-sound.wav");
const clickSound = new Audio("click-sound.wav");

// Win conditions for the game
let winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 4, 8], [2, 4, 6], [0, 3, 6],
    [1, 4, 7], [2, 5, 8]
];

// Initialize the game display settings
PCS.style.display = 'block';
final.style.display = 'none';
game.style.display = 'none';

// Show choice modal for game mode
function showChoiceModal() {
    choiceModal.style.display = "flex";
}

// Set the player's symbol and start the game
function selectSymbol(symbol) {
    playerSymbol = symbol;
    computerSymbol = symbol === "X" ? "O" : "X";
    friendSymbol = symbol === "X" ? "O" : "X";
    isPlayerTurn = true;
    gameActive = true;

    choiceModal.style.display = "none";
    PCS.style.display = "none";
    game.style.display = "flex"; // Show game board
    restartGame(); // Reset the game
}

// Fully reset the game state
function restartGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.backgroundColor = "";
    });
    status.innerText = "Your turn";
    gameActive = true;
    isPlayerTurn = true;
    initializeCells(); // Reinitialize event listeners for cells
    final.style.display = "none"; // Hide the congratulations screen
}

// Initialize cell event listeners
function initializeCells() {
    cells.forEach(cell => {
        cell.removeEventListener("click", handleCellClick); // Remove any existing listeners
        cell.addEventListener("click", handleCellClick); // Add fresh listener
    });
}

// Handle clicks for each cell
function handleCellClick(event) {
    const cell = event.target;
    if (gameActive && cell.innerText === "") {
        if (isPlayerTurn) {
            cell.innerText = playerSymbol;
            clickSound.play();
            status.innerText = player === "Friend" ? "Friend's turn" : "Computer's turn";
            checkWin();

            if (gameActive && player === "Computer") {
                isPlayerTurn = false;
                setTimeout(computerMove, 1500); // Delay computer move
            } else {
                isPlayerTurn = !isPlayerTurn;
            }
        } else if (player === "Friend") {
            cell.innerText = friendSymbol;
            clickSound.play();
            status.innerText = "Your turn";
            isPlayerTurn = !isPlayerTurn;
            checkWin();
        }
    }
}

// Play with computer mode
function playWithComputer() {
    player = "Computer";
    showChoiceModal();
    initializeCells();
}

// Play with friend mode
function playWithFriend() {
    player = "Friend";
    showChoiceModal();
    initializeCells();
}

// Computer makes a move
function computerMove() {
    if (!gameActive) return; // If game is not active, exit

    let emptyCells = Array.from(cells).filter(cell => cell.innerText === ""); // Find empty cells
    if (emptyCells.length === 0) return; // No moves left

    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]; // Randomly select an empty cell
    randomCell.innerText = computerSymbol; // Place computer's symbol
    clickSound.play();
    status.innerText = "Your turn"; // Update status to player's turn
    isPlayerTurn = true; // Set to player’s turn after computer's move

    checkWin(); // Check for win after computer's move
}


// Check win or draw conditions
function checkWin() {
    let board = Array.from(cells).map(cell => cell.innerText); // Get current board state

    for (let condition of winConditions) {
        let [a, b, c] = condition;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false; // Stop the game

            if (board[a] === playerSymbol) {
                status.innerText = `Player ${board[a]} wins! 🎉`;
                winSound.play(); // Play win sound for player
                setTimeout(() => {
                    game.style.display = "none"; // Hide game board
                    final.style.display = "flex"; // Show congratulations screen
                }, 1000);
            } else {
                status.innerText = `${player} wins! 🎉`;
                drawSound.play(); // Play sound for friend/computer
                setTimeout(() => {
                    status2.innerText = `${player} wins! You Lose 😞`; // Update status
                    document.querySelector('.comwin').style.display = "flex";
                }, 1000);
              
            }

            // Highlight winning cells
            [a, b, c].forEach(index => cells[index].style.backgroundColor = board[a] === playerSymbol ? "#1bf9ac" : "rgb(247, 104, 125)");
            return; // Exit function if win condition is met
        }
    }

    // Check for a draw
    if (board.every(cell => cell !== "") && gameActive) {
        status.innerText = "It's a draw!";
        drawSound.play();
        gameActive = false;
    }
}

// Reset game and UI to play again
function play_again() {
    document.querySelector('.comwin').style.display = "none"; // Hide result screen
    final.style.display = "none"; // Hide congratulations screen
    game.style.display = "none"; // Hide game board
    PCS.style.display = "flex"; // Show the initial player choice screen
    restartGame(); // Reset the game state
}
