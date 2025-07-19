// 游戏常量
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const NEXT_PIECE_COLS = 4;
const NEXT_PIECE_ROWS = 4;

// 方块形状定义
const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

// 方块颜色定义
const COLORS = {
    I: '#00f0f0',
    J: '#0000f0',
    L: '#f0a000',
    O: '#f0f000',
    S: '#00f000',
    T: '#a000f0',
    Z: '#f00000'
};

// 游戏状态
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPiece = null;
let nextPiece = null;
let currentPosition = { x: 0, y: 0 };
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let isPaused = false;
let dropInterval = 1000; // 初始下落速度(毫秒)
let dropStart = null;
let gameLoopId = null;
let isHardDropping = false; // 添加硬降标记

// DOM元素
const gameBoard = document.getElementById('game-board');
const nextPieceBoard = document.getElementById('next-piece');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');

// 初始化游戏板
function initBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
    
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'empty');
            cell.id = `cell-${y}-${x}`;
            gameBoard.appendChild(cell);
        }
    }
}

// 初始化下一个方块预览板
function initNextPieceBoard() {
    nextPieceBoard.innerHTML = '';
    nextPieceBoard.style.gridTemplateColumns = `repeat(${NEXT_PIECE_COLS}, 1fr)`;
    nextPieceBoard.style.gridTemplateRows = `repeat(${NEXT_PIECE_ROWS}, 1fr)`;
    
    for (let y = 0; y < NEXT_PIECE_ROWS; y++) {
        for (let x = 0; x < NEXT_PIECE_COLS; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'empty');
            cell.id = `next-cell-${y}-${x}`;
            nextPieceBoard.appendChild(cell);
        }
    }
}

// 随机生成方块
function randomPiece() {
    const keys = Object.keys(SHAPES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
        shape: SHAPES[randomKey],
        type: randomKey,
        color: COLORS[randomKey]
    };
}

// 绘制游戏板
function drawBoard() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const cell = document.getElementById(`cell-${y}-${x}`);
            cell.className = 'cell';
            
            if (board[y][x]) {
                cell.classList.add(board[y][x]);
            } else {
                cell.classList.add('empty');
            }
        }
    }
}

// 绘制当前方块
function drawPiece() {
    if (!currentPiece) return;
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const boardY = currentPosition.y + y;
                const boardX = currentPosition.x + x;
                
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    const cell = document.getElementById(`cell-${boardY}-${boardX}`);
                    cell.className = 'cell';
                    cell.classList.add(currentPiece.type);
                }
            }
        }
    }
}

// 绘制下一个方块
function drawNextPiece() {
    if (!nextPiece) return;
    
    // 清空下一个方块预览板
    const cells = nextPieceBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell empty';
    });
    
    // 计算居中位置
    const offsetX = Math.floor((NEXT_PIECE_COLS - nextPiece.shape[0].length) / 2);
    const offsetY = Math.floor((NEXT_PIECE_ROWS - nextPiece.shape.length) / 2);
    
    // 绘制下一个方块
    for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
            if (nextPiece.shape[y][x]) {
                const cellY = offsetY + y;
                const cellX = offsetX + x;
                const cell = document.getElementById(`next-cell-${cellY}-${cellX}`);
                cell.className = 'cell';
                cell.classList.add(nextPiece.type);
            }
        }
    }
}

// 检查碰撞
function collision(x, y, piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (!piece.shape[row][col]) continue;
            
            const newX = x + col;
            const newY = y + row;
            
            if (newX < 0 || newX >= COLS || newY >= ROWS) {
                return true;
            }
            
            if (newY < 0) continue;
            
            if (board[newY][newX]) {
                return true;
            }
        }
    }
    return false;
}

// 旋转方块
function rotate() {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotated = [];
    const piece = currentPiece.shape;
    
    // 转置矩阵
    for (let i = 0; i < piece[0].length; i++) {
        rotated.push([]);
        for (let j = piece.length - 1; j >= 0; j--) {
            rotated[i].push(piece[j][i]);
        }
    }
    
    // 检查旋转后是否会碰撞
    const testPiece = {
        shape: rotated,
        type: currentPiece.type,
        color: currentPiece.color
    };
    
    if (!collision(currentPosition.x, currentPosition.y, testPiece)) {
        currentPiece.shape = rotated;
        drawBoard();
        drawPiece();
    }
}

// 锁定方块到游戏板
function lock() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const boardY = currentPosition.y + y;
                const boardX = currentPosition.x + x;
                
                if (boardY < 0) {
                    gameOver = true;
                    showGameOver();
                    return;
                }
                
                // 确保方块类型正确保存到游戏板上
                board[boardY][boardX] = currentPiece.type;
            }
        }
    }
    
    // 生成新方块
    currentPiece = nextPiece;
    nextPiece = randomPiece();
    currentPosition = {
        x: Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2),
        y: -1
    };
    
    // 检查游戏是否结束
    if (collision(currentPosition.x, currentPosition.y, currentPiece)) {
        gameOver = true;
    }
    
    drawNextPiece();
}

// 清除完整的行
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        let isLineComplete = true;
        
        for (let x = 0; x < COLS; x++) {
            // 只有当一行中的所有格子都有方块时才算完整
            if (!board[y][x]) {
                isLineComplete = false;
                break;
            }
        }
        
        if (isLineComplete) {
            // 移除该行
            board.splice(y, 1);
            // 在顶部添加新行
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++; // 重新检查当前行(因为上面移动了)
        }
    }
    
    if (linesCleared > 0) {
        // 更新分数
        lines += linesCleared;
        score += calculateScore(linesCleared);
        
        // 每清除10行升一级
        level = Math.floor(lines / 10) + 1;
        
        // 更新下落速度(每升一级加快50毫秒)
        dropInterval = Math.max(100, 1000 - (level - 1) * 50);
        
        // 更新UI
        scoreElement.textContent = score;
        levelElement.textContent = level;
        linesElement.textContent = lines;
    }
}

// 计算得分
function calculateScore(lines) {
    switch (lines) {
        case 1: return 100 * level;
        case 2: return 300 * level;
        case 3: return 500 * level;
        case 4: return 800 * level;
        default: return 0;
    }
}

// 移动方块
function movePiece(direction) {
    if (!currentPiece || gameOver || isPaused) return false;
    
    let newX = currentPosition.x;
    let newY = currentPosition.y;
    let moved = false;
    
    switch (direction) {
        case 'left':
            newX--;
            break;
        case 'right':
            newX++;
            break;
        case 'down':
            newY++;
            break;
    }
    
    if (!collision(newX, newY, currentPiece)) {
        currentPosition.x = newX;
        currentPosition.y = newY;
        moved = true;
        
        drawBoard();
        drawPiece();
        
        if (direction === 'down') {
            // 不重置下落计时器，让游戏循环自然处理下落
            // 这样松开下箭头后方块会继续自动下落
        }
    } else if (direction === 'down') {
        lock();
    }
    
    return moved;
}

// 快速下落
function hardDrop() {
    if (!currentPiece || gameOver || isPaused) return;
    
    isHardDropping = true; // 设置硬降标记
    
    while (!collision(currentPosition.x, currentPosition.y + 1, currentPiece)) {
        currentPosition.y++;
    }
    
    drawBoard();
    drawPiece();
    lock();
    
    // 检查并清除完整的行
    clearLines();
    
    // 确保在lock后重新绘制游戏板，显示锁定的方块
    drawBoard();
    
    // 重置下落计时器，确保游戏循环继续
    dropStart = performance.now();
    isHardDropping = false; // 清除硬降标记
}

// 游戏循环
function gameLoop(timestamp) {
    if (gameOver || isPaused) return;
    
    // 确保dropStart有值
    if (!dropStart) {
        dropStart = timestamp;
    }
    
    const delta = timestamp - dropStart;
    
    if (delta > dropInterval) {
        if (!movePiece('down')) {
            // 只在自然下落触底时检查清除行，避免与硬降重复
            if (!isHardDropping) {
                clearLines();
            }
        }
        dropStart = timestamp;
    }
    
    drawBoard();
    drawPiece();
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

// 开始游戏
function startGame() {
    // 重置游戏状态
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    currentPiece = randomPiece();
    nextPiece = randomPiece();
    currentPosition = {
        x: Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2),
        y: -1
    };
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    isPaused = false;
    dropInterval = 1000;
    isHardDropping = false; // 重置硬降标记
    
    // 清除之前的游戏循环
    if(gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    
    // 更新UI
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
    
    // 绘制初始状态
    drawBoard();
    drawPiece();
    drawNextPiece();
    
    // 开始游戏循环
    dropStart = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
    
    // 更新按钮状态
    startButton.textContent = '重新开始';
    pauseButton.disabled = false;
}

// 暂停/继续游戏
function togglePause() {
    if (gameOver) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        cancelAnimationFrame(gameLoopId);
        pauseButton.textContent = '继续';
    } else {
        dropStart = performance.now();
        gameLoopId = requestAnimationFrame(gameLoop);
        pauseButton.textContent = '暂停';
    }
}

// 键盘控制
function keyDownHandler(e) {
    if (gameOver) return;
    
    switch (e.keyCode) {
        case 37: // 左箭头
            movePiece('left');
            break;
        case 39: // 右箭头
            movePiece('right');
            break;
        case 40: // 下箭头
            movePiece('down');
            break;
        case 38: // 上箭头
            rotate();
            break;
        case 32: // 空格
            hardDrop();
            break;
        case 80: // P键
            togglePause();
            break;
    }
}

// 初始化游戏
function init() {
    initBoard();
    initNextPieceBoard();
    
    // 添加事件监听器
    document.addEventListener('keydown', keyDownHandler);
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    
    // 初始状态
    pauseButton.disabled = true;
    
    // 显示游戏说明
    console.log('俄罗斯方块游戏已初始化');
    console.log('使用方向键控制方块移动，空格键快速下落');
}

// 显示游戏结束
function showGameOver() {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = '<h2>游戏结束</h2><p>最终得分: ' + score + '</p><button onclick="startGame()">重新开始</button>';
    document.body.appendChild(gameOverDiv);
}

// 启动游戏
window.onload = init;