const TILE_SIZE = 32;
var canvasWidth = 25 * TILE_SIZE;
var canvasHeight = 21 * TILE_SIZE + 2 * TILE_SIZE;

const GameState = Object.freeze({ PLAY: 0, PAUSE: 1, PLAYER_WON: 2, PLAYER_LOST: 3 });

const Direction = Object.freeze({ EAST: { dx: +1, dy:0, angle: 0 },
                                  NORTH:{ dx: 0, dy:-1, angle: -Math.PI / 2},
                                  WEST: { dx: -1, dy:0, angle: Math.PI },
                                  SOUTH: { dx: 0, dy:+1, angle: Math.PI / 2 }
                });


var imgBrick, imgPowerUp, imgFruit, imgPacman;
var grid;
var pacmanRespawnX, pacmanRespawnY;
var pacman;
var fruitsTotal;

function preload(){
	imgBrick = loadImage("res/img/brick.bmp");
	imgPowerUp = loadImage("res/img/grape.png");
	imgFruit = loadImage("res/img/food.png");	
	imgPacman = loadImage("res/img/Pacman2.png");
	TileType = Object.freeze({ EMPTY: {img:null}, BRICK: {img: imgBrick}, FRUIT: {img: imgFruit}, POWER_UP: {img: imgPowerUp} });
	console.log("All resources was successfully loaded");
}

function setup() {
	console.log("Setup started");
	frameRate(16);
    createCanvas(canvasWidth, canvasHeight);
    grid = new Grid();
    pacman = new Pacman(grid.pacmanRespawnX, grid.pacmanRespawnY, TILE_SIZE / 4, Direction.EAST);
    fruitsTotal = grid.fruits;
    console.log("Setup finished");
}

function keyPressed(){
	//console.log("Key pressed");
	if(keyCode === RIGHT_ARROW){
		pacman.setDirection(Direction.EAST)
		pacman.setMoving(true);	
		//console.log("Pacman moving to the right");
	} else if(keyCode === LEFT_ARROW){
		pacman.setDirection(Direction.WEST)
		pacman.setMoving(true);
	} else if(keyCode == UP_ARROW){
		pacman.setDirection(Direction.NORTH)
		pacman.setMoving(true);
	} else if(keyCode == DOWN_ARROW){
		pacman.setDirection(Direction.SOUTH)
		pacman.setMoving(true);
	} else {
		pacman.setMoving(false);
	}
}

function keyReleased(){
	//console.log("Key released");
	if(keyCode === RIGHT_ARROW){
		pacman.setDirection(Direction.EAST);
		pacman.setMoving(false);
	} else if(keyCode === LEFT_ARROW){
		pacman.setDirection(Direction.WEST);
		pacman.setMoving(false);
	} else if(keyCode == UP_ARROW){
		pacman.setDirection(Direction.NORTH);
		pacman.setMoving(false);
	} else if(keyCode == DOWN_ARROW){
		pacman.setDirection(Direction.SOUTH);
		pacman.setMoving(false);
	}
}

//main loop
function draw() {
	pacman.update(0.0625);
	background(0);
	grid.render();
	pacman.render();
	renderScore();
}

function renderScore(){
	textSize(30);
	fill(255,35,0);
	let score = pacman.score;
	text("Pacman score: " + score + " lives: " + pacman.lives, TILE_SIZE, 22 * TILE_SIZE);
}


/*
var lastPrint;
var i = 0;

function setup() {
  createCanvas(windowWidth, windowHeight); //set canvas to window width and window height
  background("#dc3787"); //background of pink
  lastPrint = millis() - 3000;
}

//print i every 3 seconds from 0 - 10

function draw() {
  var timeElapsed = millis() - lastPrint;
  //console.log(timeElapsed);

  if (timeElapsed > 3000) {
    i++;
    console.log(i);
    lastPrint = millis();
  }
}

function windowResized() { //P5 window resize function
  resizeCanvas(windowWidth, windowHeight);
}
*/
