const TILE_SIZE = 32;
const FIELD_WIDTH = 25;
const FIELD_HEIGHT = 21;
var canvasWidth = FIELD_WIDTH * TILE_SIZE;
var canvasHeight = FIELD_HEIGHT * TILE_SIZE + 2 * TILE_SIZE;

const GameState = Object.freeze({ PLAY: 0, PAUSE: 1, PLAYER_WON: 2, PLAYER_LOST: 3 });

const Direction = Object.freeze({ EAST: { index: 0, dx: +1, dy:0, angle: 0 },
								  SOUTH: { index: 1, dx: 0, dy:+1, angle: Math.PI / 2 },
                                  WEST: { index: 2, dx: -1, dy:0, angle: Math.PI },                                  
                                  NORTH:{ index: 3, dx: 0, dy:-1, angle: -Math.PI / 2}                                  
                });
const AllDirections = [ Direction.EAST, Direction.SOUTH, Direction.WEST, Direction.NORTH ];

const GhostType = Object.freeze({ RED: 0, ORANGE: 1, PINK: 2, BLUE: 3 });
const AllGhostTypes = [ GhostType.RED, GhostType.ORANGE, GhostType.PINK, GhostType.BLUE ];
const GhostMode = Object.freeze({ IN_BOX: 0, SCATTER: 1, SCARED: 2, CHASE: 3, GOING_HOME: 4 });

var imgBrick, imgPowerUp, imgFruit, imgPacman, imgGhosts;
var grid;
var pacmanRespawnX, pacmanRespawnY;
var pacman;
var fruitsTotal;
var pathfinder;
var optPath;
var startX, startY, endX, endY;
var ghosts = [];
var gameState;
var bonusWasSet = false;
var bonusTimer = 0;
var bonusLifeTime = 9;
var bonusX = 0, bonusY = 0;
var initTime = 0;

function preload(){
	imgBrick = loadImage("res/img/brick.bmp");
	imgBonus = loadImage("res/img/grape.png");
	imgFruit = loadImage("res/img/food.png");	
	imgPacman = loadImage("res/img/Pacman2.png");
	imgGhosts = loadImage("res/img/ghosts.png");
	TileType = Object.freeze({
		 EMPTY: {img:null},
		 BRICK: {img: imgBrick},
		 FRUIT: {img: imgFruit},
		 POWER_UP: {img: null},
		 BONUS: {img: imgBonus}
	});

	console.log("All resources was successfully loaded");
}

function setup() {
	frameRate(16);
    createCanvas(canvasWidth, canvasHeight);
    grid = new Grid();    
    pacman = new Pacman(grid.pacmanRespawnX, grid.pacmanRespawnY, TILE_SIZE / 4, Direction.EAST);
    fruitsTotal = grid.fruits;
    console.log("fruitsTotal = " + fruitsTotal);
    pathfinder = new PathFinder();
    createGhosts();
    gameState = GameState.PLAY;
}

//main loop
function draw() {
	var frameTime = (millis() - initTime) / 1000;
	// updating
	updatePhase(frameTime);	
	///Rendering 
	renderPhase(frameTime);	
	initTime = millis();
}

function updatePhase(frameTime){
	if(gameState === GameState.PLAY){
		pacman.update(frameTime);
		ghosts.forEach(g => {
			g.update(frameTime);
		});
		updateBonus(frameTime);
		checkCollisions();		
		checkGameStatus();		
	}
}

function updateBonus(frameTime){
	setRandomBonus();
	if(bonusWasSet){
		bonusTimer += 0.0625;
		if(bonusTimer >= bonusLifeTime){
			grid.setTileType(bonusY, bonusX, TileType.EMPTY);
			bonusWasSet = false;
			bonusTimer = 0;
		}	
	}
}

function renderPhase(){
	background(0);
	grid.render();
	ghosts.forEach(g => {
		g.render();
	});
	pacman.render();
	renderScore();
	renderGameStatus();
}

function renderScore(){
	textSize(30);
	fill(255,35,0);
	noStroke();
	let score = pacman.score;
	text("Pacman score: " + score + " fruits: " + pacman.totalFruitEaten + "/" + fruitsTotal + " lives: " + pacman.lives, TILE_SIZE, 22 * TILE_SIZE);
}

function renderGameStatus(){
	noStroke();
	textSize(100);
	if(gameState === GameState.PAUSE){
		fill(255,255,0);
		text("Game paused", canvasWidth / 12, canvasHeight / 2);
	} else if(gameState === GameState.PLAYER_WON){
		fill(0,255,0);
		text("YOU WON!!!", canvasWidth / 12, canvasHeight / 2);
	} else if(gameState === GameState.PLAYER_LOST){
		fill(255,0,0);
		text("YOU LOST!", canvasWidth / 12, canvasHeight / 2);
	}
}

function createGhosts(){
	console.log("Ghost creating");
	ghosts = [];
	AllGhostTypes.forEach(type => {
		let pos = grid.ghostPositions.get(type);
		let rd = floor(random(AllDirections.length));
		let randDir = AllDirections[rd];
		ghosts.push(new Ghost(pos.x, pos.y, randDir, type));	
	});
	ghosts.forEach(g => g.isEaten = true);
	
}

function setRandomBonus(){
	if(!bonusWasSet && pacman.totalFruitEaten > 0 && pacman.totalFruitEaten % 25 === 0){
		let emptyTiles = [];
		for(let row = 0; row < grid.rows; ++row){
			for(let col = 0; col < grid.cols; ++col){
				if(!grid.pathfindingGrid[row][col].isWall){
					emptyTiles.push({ row: row, col: col});
				}
			}
		}
		let randIndex = floor(random(emptyTiles.length));
		bonusX = emptyTiles[randIndex].col;
		bonusY = emptyTiles[randIndex].row;
		if(grid.getTileType(bonusY, bonusX) === TileType.FRUIT){
			--fruitsTotal;
		}
		grid.setTileType(bonusY, bonusX, TileType.BONUS);
		bonusWasSet = true;
	}
}

function checkCollisions(){
	let reset = false;
	let pacmanNeighbours = grid.pathfindingGrid[pacman.y][pacman.x].neighbours;

	for(let i = 0; i < ghosts.length; ++i){
		let currGhost = ghosts[i];
		if(!currGhost.isEaten){
			let collision = false;

			for(let j = 0; j < pacmanNeighbours.length; ++j){
				if(currGhost.x === pacmanNeighbours[j].x
					&& currGhost.y === pacmanNeighbours[j].y){
					collision = true;
					break;		
				}
			}

			if(collision){
				if(currGhost.mode === GhostMode.SCARED){
					pacman.eatGhost(currGhost);
					return;
				} else {
					pacman.hit();
					reset = true;
					ghosts.forEach(g => g.goToBox());
					return;
				}		
			}
		}	
	}
	if(reset){
		this.setPosition(grid.pacmanRespawnX, grid.pacmanRespawnY);
		ghosts.forEach(g => g.goToBox());
	}
}

function checkGameStatus(){
	if(!pacman.isAlive()){
		gameState = GameState.PLAYER_LOST;
	} else if(pacman.totalFruitEaten >= fruitsTotal){
		gameState = GameState.PLAYER_WON;
	}
}

function startNewGame(){
	grid = new Grid();    
    pacman = new Pacman(grid.pacmanRespawnX, grid.pacmanRespawnY, TILE_SIZE / 4, Direction.EAST);
    fruitsTotal = grid.fruits;
    pathfinder = new PathFinder();
    createGhosts();
    gameState = GameState.PLAY;
}

function togglePause(){
	if(gameState === GameState.PLAY){
		gameState = GameState.PAUSE;
	} else if(gameState === GameState.PAUSE){
		gameState = GameState.PLAY;
	}
}

function keyPressed(){
	if(keyCode === RIGHT_ARROW){
		pacman.setDirection(Direction.EAST)
		pacman.setMoving(true);	
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

	if(key === ' ' ){
		togglePause();
	} else if(key === 'N'){
		startNewGame();
	}
}