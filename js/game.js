'use strict'
const boardRestElement = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}
var gLevel = {
    SIZE: 9,
    MINES: 10
}
var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livescount: 3
}

function onInit() {
    gGame.isOn = true
    renderTimer()
    gBoard = createBoard(gLevel.SIZE)
    renderBoard(gBoard)
}

function createBoard(boardSize) {
    var board = []
    for (var i = 0; i < boardSize; i++) {
        board.push([])
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = { ...boardRestElement }
        }
    }
    // board[3][3] = {
    //     minesAroundCount: 0,
    //     isShown: false,
    //     isMine: true,
    //     isMarked: false
    // }

    // board[1][1] = {
    //     minesAroundCount: 0,
    //     isShown: false,
    //     isMine: true,
    //     isMarked: false
    // }

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
            if (mine) {
                strHTML += `<td class="cell" data-cell="${dateName}" 
                                onclick="onCellClicked(this)">*
                            </td>`

            } else {
                strHTML += `<td class="cell" data-cell="${dateName}" 
                                onclick="onCellClicked(this)">
                            </td>`
            }
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    setMinesNegsCount(gBoard)

}

function onCellClicked(elCell) {
    if (gGame.secsPassed === 0) startTimer()
    const cellLocation = elCell.dataset.cell
    const parts = cellLocation.split('-');
    var i = Number(parts[0])
    var j = Number(parts[1])
    if (gGame.secsPassed === 0) domMines(gBoard, i, j)
    if (gBoard[i][j].isMine && gGame.livescount !== 0) {
        gGame.livescount--
        var heart = document.querySelector(".hearts").innerText
        var newHeaets = heart.slice(0)
        document.querySelector(".hearts").innerText = newHeaets
    }
    else if (gBoard[i][j].isMine) checkGameOver(false)
    if (!gBoard[i][j].isMine) expandShown(gBoard, elCell, i, j)
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

function expandShown(board, elCell, cellI, cellJ) {
    board[cellI][cellJ].isShown = true
    var minesAround = board[cellI][cellJ].minesAroundCount
    if (minesAround > 0) elCell.innerText = minesAround
    gGame.shownCount++
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (!gBoard[i][j].isMine) {
                board[i][j].isShown = true
                gGame.shownCount++
                var minesAround = gBoard[i][j].minesAroundCount
                if (minesAround > 0) document.querySelector(`[data-cell="${i}-${j}"]`).innerText = minesAround

            }
        }
    }
}

function checkGameOver(isEnd) {
    gGame.isOn = isEnd
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

    clearInterval(gTimerInterval)
    gElapsedTime = 0
    gGame.secsPassed = 0
    renderTimer()
    gBoard = createBoard(gLevel.SIZE)
    renderBoard(gBoard)
}


