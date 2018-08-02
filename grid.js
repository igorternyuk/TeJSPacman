class Grid{
	constructor(){
		this.rows = platform.length;
		this.cols = platform[0].length;
		this.grid = createMatrix(this.rows, this.cols);
		this.pathfindingGrid = createMatrix(this.rows, this.cols);
		this.bricks = [];
		this.powerups = [];
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col] = platform[row][col];
				if(platform[row][col] == 'X'){
					this.pathfindingGrid[row][col] = -1;
					this.bricks.push(new Brick(col * TILE_SIZE, row * TILE_SIZE));
				} else if(platform[row][col] == 'o'){
					this.pathfindingGrid[row][col] = 0;
					this.powerups.push(new PowerUp(col * TILE_SIZE, row * TILE_SIZE));
				} else {
					this.pathfindingGrid[row][col] = 0;
				}
			}
		}
	}

	getBricks(){
		return this.bricks;
	}

	getPowerUps(){
		return this.powerups;
	}

	render(){
		this.bricks.forEach(b => {
			b.render();
		});
	}
}