class Spot{
	constructor(x,y, isWall = false){
		this.x = x;
		this.y = y;
		this.isWall = isWall;
		this.f = 0;
		this.cost = 0;		
		this.heuristic = 0;	
		this.prev = null;
		this.prevDir = null;
	}

	getNeighboursMoor(grid){
		let neighbours = [];
		for(let dy = -1; dy < 2; ++dy){
			for(let dx = -1; dx < 2; ++dx){
				let nx = this.x + dx;
				let ny = this.y + dy;
				if(isValidCoordinates(grid, nx, ny) && !grid[ny][nx].isWall){
					neighbours.push(grid[ny][nx]);
				}		
			}
		}
		return neighbours;
	}

	getNeighboursVonNeumann(grid){
		let directions = [[1,0],[0,1],[-1,0],[0,-1]];
		let neighbours = [];
		for(let i = 0; i < directions.length; ++i){
			let nx = this.x + directions[i][0];
			let ny = this.y + directions[i][1];
			if(isValidCoordinates(grid, nx, ny) && !grid[ny][nx].isWall){
				neighbours.push(grid[ny][nx]);
			}
		}
		return neighbours;
	}
	
	render(color){
		fill(color);
		noStroke();
		ellipse(this.x * spotWidth + spotWidth / 2, this.y * spotHeight + spotHeight / 2,
		     0.8 * spotWidth, 0.8 * spotHeight);
	}

}