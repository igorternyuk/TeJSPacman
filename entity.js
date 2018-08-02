class Entity{
	constructor(x, y, speed, direction){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.direction = direction;
		this.radius = TILE_SIZE / 2;
	}

	left(){
		return this.x - this.radius;
	}

	top(){
		return this.y - this.radius;
	}

	right(){
		return this.x + this.radius;
	}

	bottom(){
		return this.y + this.radius;
	}

	update(){
		this.x += this.speed * this.direction.dx;
		this.y += this.speed * this.direction.dy;
	}

	render(){

	}
	
}