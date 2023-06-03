const tiles=document.querySelectorAll('[tile-cell]')
const counter=document.querySelector('[counter-cell]')
const restartButton=document.querySelector('[restart-button]')

let clickedCount=0,firstPairValue,secondPairValue,triesLeft,pairsFound
const tileAry=[
  "pair1",
  "pair1",
  "pair2",
  "pair2",
  "pair3",
  "pair3",
  "pair4",
  "pair4",
  "pair5",
  "pair5",
  "pair6",
  "pair6"
]

startGame(false)

function shuffle(array){
  let index=array.length, randomIndex

  while (index!=0){
    randomIndex=Math.floor(Math.random()*index)
    index--
    [array[index],array[randomIndex]]=[array[randomIndex],array[index]]
  }
}

function startGame(restart){
  shuffle(tileAry)
  let index=0
  tiles.forEach(tile => {
    tile.addEventListener("click", tileClick)
    tile.setAttribute("pair",tileAry[index])
    index++
    if (restart){
      tile.innerHTML=""
      tile.classList.remove("clicked")
      tile.classList.remove("found")
    }
  })
  triesLeft=5,pairsFound=0
  updateCounter()
  restartButton.removeEventListener("click",startGame)
  restartButton.classList.remove("visible")

}

function tileClick(e){
  console.log("clicked")
  const cell=e.target
  if (cellFree(cell)){
    showCell(cell)
    if (clickedCount==1){
      firstPairValue=cell.getAttribute("pair")
      console.log("first pair value "+firstPairValue)
    } else {
      if (checkPair(cell,firstPairValue)){
        markFound(cell)
        if (pairsFound==6) endGame(true)
      } else {
        setTimeout(clearBadGuess,1000,cell)
      }
    }

  }
  
}

function showCell(cell){
  if (cell.classList.contains("clicked")) return
  cell.classList.add("clicked")
  clickedCount++
  let img = createTileImage(cell)
  cell.appendChild(img)

}

function createTileImage(cell) {
  let img = document.createElement("IMG")
  img.src = "images/"+cell.getAttribute("pair")+".jpg"
  // img.width = 80
  // img.height = 80
  return img
}
//this function is currently useless, should be reworked, but works for now
function cellFree(cell){
  // console.log("function time")
  // console.log(cell.getAttribute("found"))
  return(!cell.getAttribute("found"))
}

function checkPair(cell,firstPairValue){
  secondPairValue=cell.getAttribute("pair")
  return(secondPairValue==firstPairValue)
}

function markFound(cell){
  cell.classList.add("found")
  tiles.forEach(tile =>{
    if (!tile.classList.contains("found") & tile.classList.contains("clicked")){
      tile.classList.add("found")
    }
  })
  clickedCount=0
  pairsFound++
}

function clearBadGuess(cell){
  cell.classList.remove("clicked")
  cell.innerHTML=""
  tiles.forEach(tile =>{
    if (!tile.classList.contains("found") & tile.classList.contains("clicked")){
      tile.classList.remove("clicked")
      tile.innerHTML=""
    }
  })
  clickedCount=0
  triesLeft--
  updateCounter()
  if (triesLeft==0) endGame(false)
}

function updateCounter(){
  counter.innerHTML="You have " + triesLeft +" attempts remaining!"
}

function endGame(win){
  // alert("game over")
  tiles.forEach(tile => {
    tile.removeEventListener("click",tileClick)
  })
  if (win){
    counter.innerHTML="You won!!"
  } else {
  counter.innerHTML="Game Over!!"
  }
  restartButton.classList.add("visible")
  restartButton.addEventListener("click",startGame,true)
}