'use strict'
const HEART = '❤️'
var gLastCell=''
const boardRestElement = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}
var gLevel = {
    SIZE: 9,
    MINES: 10,
    CELLS: 81
}

var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesCount: 3,
    safeClick: 3
}

function onInit() {
    gGame.isOn = true
    renderTimer()
    gBoard = createBoard(gLevel.SIZE)
    renderBoard(gBoard)
    updateSafe()
    updateHearts()
}
function createBoard(boardSize) {
    var board = []
    for (var i = 0; i < boardSize; i++) {
        board.push([])
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = { ...boardRestElement }
        }
    }
    return board
}
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            var mine = currCell.isMine
            const dateName = `${i}-${j}`
            strHTML += `<td class="cell" data-cell="${dateName}" 
                                onclick="onCellClicked(this)"
                                oncontextmenu="onCellMarked(this)">
                            </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    setMinesNegsCount(gBoard)

}
function setMinesNegsCount(board) {
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board.length; col++) {
            var currCellCount = countNegs(row, col, board)
            board[row][col].minesAroundCount = currCellCount
        }
    }
    return board

}
function countNegs(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) negsCount++
        }
    }
    return negsCount
}

function onCellClicked(elCell) {
    gLastCell =elCell
    if (gGame.secsPassed === 0) startTimer()
    const cellLocation = elCell.dataset.cell
    const parts = cellLocation.split('-');
    var i = Number(parts[0])
    var j = Number(parts[1])
    if (gGame.secsPassed === 0) domMines(gBoard, i, j) //to start the game 
    if (gBoard[i][j].isMine && gGame.livesCount === 0) { // check if the game is over
        gameOver()
        return
    }
    if (gGame.shownCount === gLevel.CELLS - gLevel.MINES) gameWon()
    if (gBoard[i][j].isMine && gGame.livesCount !== 0) { //check if you touch mine and update lives
        gGame.livesCount--
        updateHearts()
        return
    }
    if (gBoard[i][j].isShown) return
    if (isCellWithNneighbors(i, j) && gBoard[i][j].minesAroundCount > 0) {
        cellColor(i, j)
        gBoard[i][j].isShown = true
        gGame.shownCount++
        renderCell(i, j)

    }
    else {
        // fullExpande(i, j)
        expandShown(gBoard, elCell, i, j) // expanding board
    }

}

function expandShown(board, elCell, cellI, cellJ) {
    var minesAround = board[cellI][cellJ].minesAroundCount
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) {
                board[cellI][cellJ].isShown = true
                cellColor(i, j)
                gGame.shownCount++
            }
            if (!gBoard[i][j].isMine) {
                minesAround = gBoard[i][j].minesAroundCount
                if (minesAround > 0) {
                    renderCell(i,j)
                    cellColor(i, j)
                    if (!gBoard[i][j].isShown) {
                        gBoard[i][j].isShown = true
                        gGame.shownCount++
                    }
                } else if (minesAround === 0 && !gBoard[i][j].isShown) {
                    cellColor(i, j)
                    if (!gBoard[i][j].isShown) {
                        gBoard[i][j].isShown = true
                        gGame.shownCount++
                    }
                }
            }
        }
    }
}

function gameOver() {
    showALLMines()
    gGame.isOn = false
    clearInterval(gTimerInterval)
    document.querySelector('img').src = "img/dead.png"
    console.log('game is over :(((((')
}

function getRandomizeMines(mines, firstCellI, firstCellJ) {
    var emtpyCells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (i === firstCellI && j === firstCellJ) continue
            emtpyCells.push({ i: i, j: j })
        }
    }
    var minesCells = []
    for (var i = 0; i < mines; i++) {
        var randomCell = getRandomIntInclusive(0, emtpyCells.length)
        minesCells.push(emtpyCells[randomCell])
        emtpyCells.splice(randomCell, 1)
    }
    return minesCells
}

function domMines(board, i, j) {
    var randomMine = getRandomizeMines(gLevel.MINES, i, j)
    for (var i = 0; i < randomMine.length; i++) {
        var randomI = randomMine[i].i
        var randomj = randomMine[i].j
        board[randomI][randomj] = {
            minesAroundCount: 0,
            isShown: false,
            isMine: true,
            isMarked: false
        }
    }
    renderBoard(board)
}

function smileButton() {
    document.querySelector('img').src = "img/smile.png"
    gGame.safeClick =3
    gGame.livesCount = 3
    updateHearts()
    updateSafe()
    clearInterval(gTimerInterval)
    gElapsedTime = 0
    gGame.secsPassed = 0
    renderTimer()
    gBoard = createBoard(gLevel.SIZE)
    renderBoard(gBoard)
}

function onCellMarked(elCell) {
    const cellLocation = elCell.dataset.cell
    const parts = cellLocation.split('-');
    var i = Number(parts[0])
    var j = Number(parts[1])
    if (gBoard[i][j].isMarked) {
        cellColor(i, j)
        gGame.markedCount--
        gBoard[i][j].isMarked = false

    } else {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        elCell.style.backgroundColor = 'red'
    }
}

function showALLMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            const isMine = currCell.isMine
            if (isMine) {
                const elCell = document.querySelector(`td.cell[data-cell="${i}-${j}"]`)
                elCell.style.backgroundColor = 'red'
            }
        }
    }
}

function gameWon() {
    gGame.isOn = false
    console.log('you won')
    clearInterval(gTimerInterval)
    document.querySelector('img').src = "img/won.png"
}

function isCellWithNneighbors(cellI, cellJ) {
    var isNeighbor = false
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (gBoard[i][j].minesAroundCount > 0) {
                isNeighbor = true
            }
        }
    }
    return isNeighbor
}

