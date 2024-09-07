
var gTimerInterval
var gStartTime
var gElapsedTime = 0
function showModal(className){
    document.querySelector(className).classList.remove('hide')

}
function hideModal(className){
    document.querySelector(className).classList.add('hide')

}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function startTimer() {
    gElapsedTime = 0
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        gElapsedTime = Date.now() - gStartTime
        renderTimer()
    }, 10)
}

function renderTimer() {
    const seconds = (parseInt(gElapsedTime / 1000) + '').padStart(2, 0)
    const milliSeconds = (gElapsedTime % 1000 + '').padStart(3, 0)
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = `${seconds}:${milliSeconds}`
    gGame.secsPassed = gElapsedTime
}
function cellColor(i, j) {
    document.querySelector(`[data-cell="${i}-${j}"]`).style.backgroundColor = 'rgb(225, 225, 225)'
}
function updateHearts() {
    document.querySelector(".hearts").innerText = HEART.repeat(gGame.livesCount)
}

function renderCell(i,j){
    document.querySelector(`[data-cell="${i}-${j}"]`).innerText = gBoard[i][j].minesAroundCount

}

function unRenderCell(i,j){
    document.querySelector(`[data-cell="${i}-${j}"]`).innerText = ''

}

function unCellColor(i, j) {
    document.querySelector(`[data-cell="${i}-${j}"]`).style.backgroundColor = 'rgb(184, 184, 184)'
}