class Grid{
	constructor(){
		this.rows = platform.length;
		this.cols = platform[0].length;
		this.grid = createMatrix(this.rows, this.cols);
		this.pathfindingGrid = createMatrix(this.rows, this.cols);
		this.pacmanRespawnX = 0;
		this.pacmanY = 0;
		this.staticEntities = [];
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col] = platform[row][col];
				let x = col * TILE_SIZE;
				let y = row * TILE_SIZE;
				if(platform[row][col] === 'X'){
					this.grid[row][col] = new Tile(TileType.BRICK, x, y);
					this.pathfindingGrid[row][col] = -1;
				} else if(platform[row][col] === 'o'){
					this.grid[row][col] = new Tile(TileType.POWER_UP, x, y);
					this.pathfindingGrid[row][col] = 0;
				} else if(platform[row][col] === ' ') {
					this.grid[row][col] = new Tile(TileType.FRUIT, x, y);
					this.pathfindingGrid[row][col] = 0;
				} else {
					this.grid[row][col] = new Tile(TileType.EMPTY, x, y);
					this.pathfindingGrid[row][col] = 0;
				}

				if (platform[row][col] === 'p') {
					console.log("Pacman position was found row " + row + " col = " + col);
					this.pacmanRespawnX = col * TILE_SIZE + TILE_SIZE / 2;
					this.pacmanRespawnY = row * TILE_SIZE + TILE_SIZE / 2;
				}
			}
		}
		this.staticEntities = this.staticEntities.concat(this.bricks, this.powerups, this.fruits);
	}


	getCollidedTiles(entity){
		let minRow = entity.top() / TILE_SIZE;
		let maxRow = (entity.bottom() - 1) / TILE_SIZE;
		let minCol = entity.left() / TILE_SIZE;
		let maxCol = (entity.right() - 1) / TILE_SIZE;

		let collided = [];

		for(let row = minRow; row <= maxRow; ++row){
			for(let col = minCol; col <= maxCol; ++col){
				collided.push(this.grid[row][col]);
			}
		}

		return collided;
	}

	render(){
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col].render();
			}
		}
	}
}