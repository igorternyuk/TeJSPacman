class Grid{
	constructor(){
		this.rows = platform.length;
		this.cols = platform[0].length;
		this.grid = createMatrix(this.rows, this.cols);
		this.pathfindingGrid = createMatrix(this.rows, this.cols);
		this.pacmanRespawnX = 0;
		this.pacmanY = 0;
		this.fruits = 0;
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col] = platform[row][col];
				let x = col * TILE_SIZE;
				let y = row * TILE_SIZE;
				if(platform[row][col] === 'X'){
					this.grid[row][col] = new Tile(TileType.BRICK, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, true);
				} else if(platform[row][col] === 'o'){
					this.grid[row][col] = new Tile(TileType.POWER_UP, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, false);
				} else if(platform[row][col] === ' ') {
					this.grid[row][col] = new Tile(TileType.FRUIT, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, false);
					++this.fruits;
				} else {
					this.grid[row][col] = new Tile(TileType.EMPTY, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, false);
				}

				if (platform[row][col] === 'p') {
					console.log("Pacman position was found row " + row + " col = " + col);
					this.pacmanRespawnX = col;
					this.pacmanRespawnY = row;
				} 
			}
		}
	}

	getTileType(row, col){
		return this.grid[row][col].type;
	}

	isTilePassable(row, col){
		console.log("row " + row + " col = " + col);
		return this.grid[row][col].type !== TileType.BRICK;
	}

	resetPathfindingMatrix(){
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.pathfindingGrid[row][col].f = 0;
				this.pathfindingGrid[row][col].cost = 0;		
				this.pathfindingGrid[row][col].heuristic = 0;	
				this.pathfindingGrid[row][col].prev = null;
				this.pathfindingGrid[row][col].prevDir = null;
			}
		}
	}

	setTileType(row, col, type){
		if(this.grid[row][col].type === TileType.FRUIT && type !== TileType.FRUIT){
			--this.fruits;
		}
		this.grid[row][col].type = type;
	}


	render(){
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col].render();
			}
		}
	}
}