function showModal(className){
    document.querySelector(className).classList.remove('hide')

}
function hideModal(className){
    document.querySelector(className).classList.add('hide')

}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}