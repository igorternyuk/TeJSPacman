class Pacman extends Entity{
	constructor(x, y, direction){
		super(x, y, 0.25, direction);
		this.currentFrame = 0;
		this.frameCount = 12;
		this.score = 0;
		this.totalFruitEaten = 0;
		this.lives = 5;
		this.energized = false;
		this.energisersEaten = 0;
		this.energizeTimer = 0;
		this.energizerActionTime = 9;
		this.eatenGhostsMap = new Map();
		for(let i = 0; i < 4; ++i){
			this.eatenGhostsMap.set(i, 0);
		}
	}

	isAlive(){
		return this.lives > 0;
	}

	hit(){
		--this.lives;
		this.setPosition(grid.pacmanRespawnX, grid.pacmanRespawnY);
	}

	eatEnergizer(){
		this.accelerate();
		this.score += 50;
		this.energizeTimer = 0;
		this.energized = true;
		++this.energisersEaten;
		ghosts.forEach(g => {
			if(g.mode !== GhostMode.IN_BOX){
				g.scare(); 	
			}
		});
	}

	eatGhost(ghost){
		let eatenWithOneEnergizer = this.eatenGhostsMap.get(this.energisersEaten);
		this.eatenGhostsMap.set(this.energisersEaten, eatenWithOneEnergizer + 1);
		this.score += 200 * this.eatenGhostsMap.get(this.energisersEaten);
		ghost.isEaten = true;
		ghost.getEaten();
	}

	eatFruit(){
		++this.totalFruitEaten;
		this.score += 10;
		if(!this.energized){
			this.decelerate();
		}
	}

	setRegularSpeed(){
		this.moveTime = 0.25;
	}

	accelerate(){
		this.moveTime = 0.125;
	}

	decelerate(){
		this.moveTime = 0.5;
	}

	setDirection(direction){
		this.direction = direction;
	}

	setMoving(moving){
		this.isMoving = moving;
		if(!this.isMoving){
			this.currentFrame = 0;
		}
	}

	updateFrames(){
		++this.currentFrame;
		if(this.currentFrame >= this.frameCount){
			this.currentFrame = 0;
		}
	}

	update(frameTime){
		if(this.isMoving){
			
			super.update(frameTime);
			this.updateFrames();
			this.energizeTimer += frameTime;
			if(this.energizeTimer >= this.energizerActionTime){
				this.energizeTimer = 0;
				this.energized = false;
				this.setRegularSpeed();
			}
			this.checkCollisions();
		}
	}
	
	checkCollisions(){
		if(grid.getTileType(this.y, this.x) === TileType.EMPTY){
			if(!this.energized){
				this.setRegularSpeed();	
			}			
		} else if(grid.getTileType(this.y, this.x) === TileType.FRUIT){
			this.eatFruit();
			grid.setTileType(this.y, this.x, TileType.EMPTY);
		} else if(grid.getTileType(this.y, this.x) === TileType.POWER_UP){
			this.eatEnergizer();
			grid.setTileType(this.y, this.x, TileType.EMPTY);
		} else if(grid.getTileType(this.y, this.x) === TileType.BONUS){
			bonusWasSet = false;
			grid.setTileType(this.y, this.x, TileType.EMPTY);
			this.score += 100;
		}
	}

	render(){
		push();
		translate(this.x * TILE_SIZE + TILE_SIZE / 2, this.y * TILE_SIZE + TILE_SIZE / 2);
		rotate(this.direction.angle);
		imageMode(CENTER);
		image(imgPacman, 0, 0, TILE_SIZE, TILE_SIZE, this.currentFrame * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
		pop();
	}
}