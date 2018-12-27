class Spot{
	constructor(x,y, isWall = false){
		this.x = x;
		this.y = y;
		this.isWall = isWall;
		this.f = 0;
		this.cost = 0;		
		this.heuristic = 0;	
		this.prev = null;
	}

	render(color){
		fill(0,255,0);
		noStroke();
		ellipse(this.x * TILE_SIZE + TILE_SIZE / 2, this.y * TILE_SIZE + TILE_SIZE / 2,
		     0.5 * TILE_SIZE, 0.5 * TILE_SIZE);
	}

}