const TILE_SIZE = 32;
var canvasWidth = 25 * TILE_SIZE;
var canvasHeight = 21 * TILE_SIZE;

const GameState = Object.freeze({ PLAY: 0, PAUSE: 1, PLAYER_WON: 2, PLAYER_LOST: 3 });

const Direction = Object.freeze({ EAST: { dx: +1, dy:0, angle: 0 },
                                  NORTH:{ dx: 0, dy:-1, angle: -Math.PI / 2},
                                  WEST: { dx: -1, dy:0, angle: Math.PI },
                                  SOUTH: { dx: 0, dy:+1, angle: Math.PI / 2 }
                });


var imgRock;
var grid;
var pacmanRespawnX, pacmanRespawnY;
var pacman;

function preload(){
	imgBrick = loadImage("resources/img/brick.bmp");
	imgPowerUp = loadImage("resources/img/grape.png");
	imgFruit = loadImage("resources/img/food.png");
	imgPacman = loadImage("resources/img/Pacman2.png");
	TileType = Object.freeze({ EMPTY: {img:null}, BRICK: {img: imgBrick}, FRUIT: {img: imgFruit}, POWER_UP: {img: imgPowerUp} });
}

function setup() {
	frameRate(20);
    createCanvas(canvasWidth, canvasHeight);
    grid = new Grid();
    console.log("pacmanX = " + grid.pacmanRespawnX);
    pacman = new Pacman(grid.pacmanRespawnX, grid.pacmanRespawnY, TILE_SIZE / 8, Direction.EAST);
}

function keyPressed(){
	//console.log("Key pressed");
	if(keyCode === RIGHT_ARROW){
		pacman.setMoving(pacman.setDirection(Direction.EAST));	
		//console.log("Pacman moving to the right");
	} else if(keyCode === LEFT_ARROW){
		pacman.setMoving(pacman.setDirection(Direction.WEST));
	} else if(keyCode == UP_ARROW){
		pacman.setMoving(pacman.setDirection(Direction.NORTH));
	} else if(keyCode == DOWN_ARROW){
		pacman.setMoving(pacman.setDirection(Direction.SOUTH));
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
	pacman.update();

	background(0);
	grid.render();
	pacman.render();
}



