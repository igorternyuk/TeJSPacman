class Pacman extends Entity{
	constructor(x, y, speed, direction){
		super(x, y, speed, direction);
		this.isMoving = false;
		this.currentFrame = 0;
		this.frameCount = 12;
	}

	setDirection(direction){
		if(this.direction === direction){
			return true;
		}
		if(getOppositeDirection(this.direction) === direction
			|| ((this.left() % TILE_SIZE === 0) && (this.top() % TILE_SIZE === 0))){
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
		console.log("this.currentFrame = " + this.currentFrame);
	}

	update(){
		if(this.isMoving){
			super.update();
			this.updateFrames();
			console.log("pacX = " + this.x);
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