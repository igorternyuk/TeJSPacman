class Pacman extends Entity{
	constructor(x, y, direction){
		super(x, y, 0.25, direction);
		this.currentFrame = 0;
		this.frameCount = 12;
		this.score = 0;
		this.lifes = 5;
		this.energized = false;
		this.energizeTimer = 0;
		this.energizerActionTime = 9;
		console.log(" px = " + this.x + " py = " + this.y);
	}

	eatEnergizer(){
		this.accelerate();
	}

	eatFruit(){
		++this.score;
		this.decelerate();
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
		//console.log("Pacman update");
		if(this.isMoving){
			super.update(frameTime);
			this.updateFrames();
		}
	}
	

	render(){
		push();
		translate(this.x * TILE_SIZE + TILE_SIZE / 2, this.y * TILE_SIZE + TILE_SIZE / 2);
		rotate(this.direction.angle);
		imageMode(CENTER);
		image(imgPacman, 0, 0, TILE_SIZE, TILE_SIZE, this.currentFrame * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
		pop();
		//console.log("Drawing the pacman x = " + this.x + " y = " + this.y);
	}
}