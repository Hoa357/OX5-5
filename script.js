const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restartButton");
const startButton = document.getElementById("startButton");
const playerSelect = document.getElementById("playerSelect");
const endButton = document.getElementById("endButton"); // Đảm bảo endButton đã được định nghĩa

let board = Array(5).fill(null).map(() => Array(5).fill(""));
let currentPlayer = "X"; // Người chơi là X
let isGameActive = true;
let playWithAI = false;
let moveCount = 0;

const winningConditions = [];

// Kiểm tra hàng
for (let i = 0; i < 5; i++) {
    winningConditions.push([i, 0, i, 1, i, 2, i, 3, i, 4]); // Hàng
}

// Kiểm tra cột
for (let i = 0; i < 5; i++) {
    winningConditions.push([0, i, 1, i, 2, i, 3, i, 4]); // Cột
}

// Kiểm tra đường chéo
winningConditions.push([0, 0, 1, 1, 2, 2, 3, 3, 4, 4]); // Đường chéo chính
winningConditions.push([0, 4, 1, 3, 2, 2, 3, 1, 4, 0]); // Đường chéo phụ

startButton.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";
    resetGame();
});

endButton.addEventListener("click", () => {
    welcomeScreen.style.display = "block";
    gameScreen.style.display = "none";
});

playerSelect.addEventListener("change", () => {
    playWithAI = playerSelect.value === "ai";
    resetGame();
});

function resetGame() {
    board = Array(5).fill(null).map(() => Array(5).fill(""));
    currentPlayer = "X";
    isGameActive = true;
    moveCount = 0;
    statusElement.textContent = "";
    createBoard();
}

function createBoard() {
    boardElement.innerHTML = ""; // Xóa nội dung hiện có
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = board[row][col];
            cellElement.addEventListener("click", () => handleCellClick(row, col));
            boardElement.appendChild(cellElement);
        }
    }
}

function handleCellClick(row, col) {
    if (board[row][col] !== "" || !isGameActive) return; // Kiểm tra ô đã chọn chưa hoặc game không hoạt động
    board[row][col] = currentPlayer; // Cập nhật ô với người chơi hiện tại
    moveCount++; // Tăng số lượt di chuyển

    if (checkWinner(currentPlayer)) {
        statusElement.textContent = `Người Chơi ${currentPlayer} thắng!`; // Hiển thị thông báo thắng
        isGameActive = false; // Dừng game
    } else if (moveCount === 25) {
        statusElement.textContent = "Hòa!"; // Hiển thị thông báo hòa
        isGameActive = false; // Dừng game
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Chuyển lượt
    }

    createBoard(); // Cập nhật hiển thị bảng

    if (isGameActive && playWithAI && currentPlayer === "O") {
        aiMove(); // Gọi AI để thực hiện nước đi
    }
}

function checkWinner(player) {
    // Kiểm tra tất cả các điều kiện thắng
    for (const condition of winningConditions) {
        const [a1, b1, a2, b2, a3, b3, a4, b4, a5, b5] = condition;
        if (
            board[a1][b1] === player &&
            board[a2][b2] === player &&
            board[a3][b3] === player &&
            board[a4][b4] === player &&
            board[a5][b5] === player
        ) {
            return true; // Nếu có người thắng
        }
    }
    return false; // Không có người thắng
}

function aiMove() {
    if (!isGameActive) return; // Kiểm tra trạng thái trò chơi

    // Check for winning move
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (board[row][col] === "") {
                board[row][col] = "O"; // Thử đặt O
                if (checkWinner("O")) {
                    moveCount++;
                    statusElement.textContent = "Người Chơi O thắng!"; // AI thắng
                    isGameActive = false;
                    return;
                }
                board[row][col] = ""; // Đặt lại nếu không thắng
            }
        }
    }

    // Block player from winning
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (board[row][col] === "") {
                board[row][col] = "X"; // Thử chặn X
                if (checkWinner("X")) {
                    board[row][col] = "O"; // Chặn
                    moveCount++;
                    currentPlayer = "X"; // Chuyển lượt về cho người chơi
                    createBoard(); // Cập nhật bảng
                    return; // Kết thúc hàm
                }
                board[row][col] = ""; // Đặt lại nếu không cần chặn
            }
        }
    }

    // Nếu không có nước thắng hoặc chặn, chọn ngẫu nhiên
    const availableSpots = board
        .flatMap((row, rowIndex) =>
            row.map((cell, colIndex) =>
                cell === "" ? { row: rowIndex, col: colIndex } : null
            )
        )
        .filter((val) => val !== null);

    if (availableSpots.length > 0) {
        const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
        board[randomSpot.row][randomSpot.col] = "O";
        moveCount++;

        if (checkWinner("O")) {
            statusElement.textContent = "Người Chơi O thắng!"; // AI thắng
            isGameActive = false; // Dừng game
        } else if (moveCount === 25) {
            statusElement.textContent = "Hòa!"; // Hòa
            isGameActive = false; // Dừng game
        }

        currentPlayer = "X"; // Chuyển lượt về cho người chơi
        createBoard(); // Cập nhật hiển thị bảng
    }
}

restartButton.addEventListener("click", resetGame);

// Hiển thị màn hình chào mừng đầu tiên
welcomeScreen.style.display = "block";
