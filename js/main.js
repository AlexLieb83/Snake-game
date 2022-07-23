//Declare global variables to track game board size
const LINE_PIXEL_COUNT = 40
const TOTAL_PIXEL_COUNT = LINE_PIXEL_COUNT**2

//Track scores to display to user
let totalFoodEaten = 0
let totalDistanceTraveled = 0

//Shorten reference to game board
const gameContainer = document.getElementById('gameContainer')

//Generate the game board
const createGameBoardPixels = () => {
  for(let i = 1; i <= TOTAL_PIXEL_COUNT; i++){
    gameContainer.innerHTML = `${gameContainer.innerHTML} <div class='gameBoardPixel' id = 'pixel${i}'></div>`;
  }
}

//Shorten references to game pixels
const gameBoardPixels = document.getElementsByClassName('gameBoardPixel')

let currentFoodPosition = 0
//create the randomly generated food items in the game board
const createFood = () => {
  gameBoardPixels[currentFoodPosition].classList.remove('food')
  currentFoodPosition = Math.floor(Math.random()*TOTAL_PIXEL_COUNT)
  //Add food to the board
  gameBoardPixels[currentFoodPosition].classList.add('food')
}

//Start setting up snake behavior - the numbers align with the directional keys on keyboard
const LEFT_DIR = 37
const UP_DIR = 38
const RIGHT_DIR = 39
const DOWN_DIR = 40 

//the snake will start out moving right
let snakeCurrentDirection = RIGHT_DIR

const changeDirection = newDirectionCode => {
  //if key pressed is same direction as snake is moving, leave function
  if(newDirectionCode == snakeCurrentDirection) return;
   
  //Make sure user input is valid and change snake direction variable
  if(newDirectionCode == LEFT_DIR && snakeCurrentDirection !== RIGHT_DIR){
    snakeCurrentDirection = newDirectionCode
  } else if(newDirectionCode == UP_DIR && snakeCurrentDirection !==      DOWN_DIR){
    snakeCurrentDirection = newDirectionCode
  } else if(newDirectionCode == RIGHT_DIR && snakeCurrentDirection !== LEFT_DIR){
    snakeCurrentDirection = newDirectionCode
  } else if(newDirectionCode == DOWN_DIR && snakeCurrentDirection !== UP_DIR){
    snakeCurrentDirection = newDirectionCode
  }
}

//set the starting position at the middle of the total pixel array aka the middle of the gameboard
let currentHeadPosition = TOTAL_PIXEL_COUNT / 2

//set initial snake length
let snakeLength = 200

//start moving snake, wrapping around to other side of screen if needed
const moveSnake = () => {
  switch(snakeCurrentDirection){
    case LEFT_DIR: 
      --currentHeadPosition
      const isHeadAtLeft = currentHeadPosition % LINE_PIXEL_COUNT == LINE_PIXEL_COUNT - 1 || currentHeadPosition < 0
      if(isHeadAtLeft){
        currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT
      }
    break;
    case RIGHT_DIR:
      ++currentHeadPosition
      const isHeadAtRight = currentHeadPosition % LINE_PIXEL_COUNT == 0
      if(isHeadAtRight){
        currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
      }
    break;
    case UP_DIR:
      currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
      const isHeadAtTop = currentHeadPosition < 0
      if(isHeadAtTop){
        currentHeadPosition = currentHeadPosition + TOTAL_PIXEL_COUNT
      }
    break;
    case DOWN_DIR:
      currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT
      //have to have -1 because we are accessing the pixels by index in an array like thing, therefore 0 - 1599
      const isHeadAtBottom = currentHeadPosition > TOTAL_PIXEL_COUNT - 1
      if(isHeadAtBottom){
        currentHeadPosition = currentHeadPosition - TOTAL_PIXEL_COUNT
      }
    break;
    default:
    break;
  }

  //accessed the correct pixel within the HTML collection
  let nextSnakeHeadPixel = gameBoardPixels[currentHeadPosition]

  //check if snake head is about to intersect with its own body, end, show score, if so
  if(nextSnakeHeadPixel.classList.contains('snakeBodyPixel')){
    clearInterval(moveSnakeInterval)
    alert(`You have eaten ${totalFoodEaten} and traveled ${totalDistanceTraveled} blocks.`)
    window.location.reload()
  }

  //assuming an empty pixel, add snake body styling
  nextSnakeHeadPixel.classList.add('snakeBodyPixel')

  //remove snake styling to keep snake the correct length
  setTimeout(() => {
  nextSnakeHeadPixel.classList.remove('snakeBodyPixel')
  }, snakeLength)

  //describe what to do if snake eats food pixel
  if(currentHeadPosition == currentFoodPosition){
    totalFoodEaten++
    document.getElementById('pointsEarned').innerText = totalFoodEaten
    snakeLength += 100
    createFood()
  }

  //added distance traveled count
  totalDistanceTraveled++
  document.getElementById('blocksTraveled').innerText = totalDistanceTraveled
}

//Call initial functions to create board and start game
createGameBoardPixels();

createFood();

//set animation speed
let moveSnakeInterval = setInterval(moveSnake, 100)

addEventListener('keydown', e => changeDirection(e.keyCode))

//adding variables for on-screen buttons
const leftButton = document.getElementById('leftButton')
const rightButton = document.getElementById('rightButton')
const upButton = document.getElementById('upButton')
const downButton = document.getElementById('downButton')

//add listeners for on-screen buttons
leftButton.onclick = () => changeDirection(LEFT_DIR)
rightButton.onclick = () => changeDirection(RIGHT_DIR)
upButton.onclick = () => changeDirection(UP_DIR)
downButton.onclick = () => changeDirection(DOWN_DIR)