'use strict'
function fullExpande(cellI, cellJ) {
    if (cellI === 0) {
        zeroI()
    }
    function zeroI() {
        for (var i = 0; i < gBoard.length; i++) {
            var stopedJ = showRow(i)
        }
    }
    function showRow(row, stopedJ) {
        console.log(stopedJ)
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[row][j]
            if (currCell.minesAroundCount == 0) {
                cellColor(row, j)
                currCell.isShown = true
                gGame.shownCount++
            }
            else {
                cellColor(row, j)
                currCell.isShown = true
                gGame.shownCount++
                renderCell(row, j)
                return j
            }
        }
    }
}
function safeClick() {
    if (gGame.safeClick === 0) return
    gGame.safeClick--
    var emtpyCells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isShown || gBoard[i][j].isMine) continue
            else emtpyCells.push({ i: i, j: j })
        }
    }
    var randomCell = getRandomIntInclusive(0, emtpyCells.length)
    emtpyCells.splice(randomCell, 1)
    emtpyCells[randomCell].i
    if (gBoard[emtpyCells[randomCell].i][emtpyCells[randomCell].j].minesAroundCount === 0) {
        cellColor(emtpyCells[randomCell].i, emtpyCells[randomCell].j)
        setTimeout(unCellColor, 1000, emtpyCells[randomCell].i, emtpyCells[randomCell].j)
    }
    else {
        renderCell(emtpyCells[randomCell].i
            , emtpyCells[randomCell].j),
            cellColor(emtpyCells[randomCell].i
                , emtpyCells[randomCell].j)
        setTimeout(unCellColor, 1000, emtpyCells[randomCell].i, emtpyCells[randomCell].j)
        setTimeout(unRenderCell, 1000, emtpyCells[randomCell].i, emtpyCells[randomCell].j)


    }
    if (gGame.safeClick === 0) {
        document.querySelector(".safe").style.display = 'none'

    }
    updateSafe()
}
function updateSafe() {
    if (gGame.safeClick > 0) document.querySelector(".safe").style.display = 'inline-block'
    document.querySelector(".safe").innerText = `safe click:${gGame.safeClick} available`
}
function undo() {
    const cellLocation = gLastCell.dataset.cell
    const parts = cellLocation.split('-');
    var i = Number(parts[0])
    var j = Number(parts[1])
    if (gBoard[i][j].minesAroundCount > 0) {
        unCellColor(i, j)
        gBoard[i][j].isShown = true
        gGame.shownCount++
        unRenderCell(i, j)

    }
    else {
        // fullExpande(i, j)
        // unExpandShown(gBoard, gLastCell, i, j) // expanding board
    }
}


