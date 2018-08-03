class Pacman extends Entity{
	constructor(x, y, speed, direction){
		super(x, y, speed, direction);
		this.currentFrame = 0;
		this.frameCount = 12;
	}

	setDirection(direction){
		if(this.direction === direction){
			return true;
		}
		if(getOppositeDirection(this.direction) === direction || this.isOnTurnPoint()){
			this.direction = direction;
			return true;
		}
		return false;
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

	update(){
		if(this.isMoving){
			super.update();
			if(grid.handleCollisions(this)){
				let collidedTiles = grid.collidedTiles;
				collidedTiles.forEach(tile => {
					if(tile.type === TileType.FRUIT){
						console.log("Collision with fruit!");
						grid.setTileType(tile.row, tile.col, TileType.EMPTY);
					}
				});
			}
			this.updateFrames();
		}
	}
	

	render(){
		push();
		translate(this.x, this.y);
		rotate(this.direction.angle);
		imageMode(CENTER);
		image(imgPacman, 0, 0, TILE_SIZE, TILE_SIZE, this.currentFrame * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
		pop();
		//console.log("Drawing the pacman x = " + this.x + " y = " + this.y);
	}
}