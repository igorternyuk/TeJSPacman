const TILE_SIZE = 32;
var canvasWidth = 25 * TILE_SIZE;
var canvasHeight = 21 * TILE_SIZE;

const GameState = Object.freeze({ PLAY: 0, PAUSE: 1, PLAYER_WON: 2, PLAYER_LOST: 3 });
const Direction = Object.freeze({ NORTH: { dx: 0, dy:-1 }, SOUTN: { dx: 0, dy:+1 }, EAST: { dx: +1, dy:0 }, WEST: { dx: -1, dy:0 } });

var imgRock;
var grid;

function preload(){
	imgRock = loadImage("resources/img/rock.bmp");
}

function setup() {
	frameRate(10);
    createCanvas(canvasWidth, canvasHeight);
    grid = new Grid();
}


//main loop
function draw() {
	background(0);
	grid.render();
}



