class Grid{
	constructor(){
		this.rows = platform.length;
		this.cols = platform[0].length;
		this.grid = createMatrix(this.rows, this.cols);
		this.pathfindingGrid = createMatrix(this.rows, this.cols);
		this.pacmanRespawnX = 0;
		this.pacmanRespawnY = 0;
		this.fruits = 0;
		this.ghostPositions = new Map();
		this.ghostLeavingPoints = new Map();
		this.ghostScatterTargets = new Map();
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col] = platform[row][col];
				let x = col * TILE_SIZE;
				let y = row * TILE_SIZE;
				if(platform[row][col] === 'X'){
					this.grid[row][col] = new Tile(TileType.BRICK, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, true);
				} else if(platform[row][col] === 'B'){
					this.grid[row][col] = new Tile(TileType.POWER_UP, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, false);
				} else if(platform[row][col] === ' ') {
					this.grid[row][col] = new Tile(TileType.FRUIT, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, false);
					++this.fruits;
				} else {
					this.grid[row][col] = new Tile(TileType.EMPTY, row, col);
					this.pathfindingGrid[row][col] = new Spot(col, row, true);
				}

				if (platform[row][col] === 'P') {
					this.pacmanRespawnX = col;
					this.pacmanRespawnY = row;
				}

				if (platform[row][col] === 'r') {
					this.pacmanRespawnX = col;
					this.pacmanRespawnY = row;
					this.ghostPositions.set(GhostType.RED, { x: col, y: row });
				}
				
				if (platform[row][col] === 'o') {
					this.pacmanRespawnX = col;
					this.pacmanRespawnY = row;
					this.ghostPositions.set(GhostType.ORANGE, { x: col, y: row });
				}  
				
				if (platform[row][col] === 'p') {
					this.pacmanRespawnX = col;
					this.pacmanRespawnY = row;
					this.ghostPositions.set(GhostType.PINK, { x: col, y: row });
				}  

				if (platform[row][col] === 'b') {
					this.pacmanRespawnX = col;
					this.pacmanRespawnY = row;
					this.ghostPositions.set(GhostType.BLUE, { x: col, y: row });
				}    
			}
		}
		this.ghostLeavingPoints.set(GhostType.RED, { x: 8, y: 8});
		this.ghostLeavingPoints.set(GhostType.ORANGE, { x: 15, y: 8});
		this.ghostLeavingPoints.set(GhostType.PINK, { x: 8, y: 13});
		this.ghostLeavingPoints.set(GhostType.BLUE, { x: 15, y: 13});

		this.ghostScatterTargets.set(GhostType.RED, this.pathfindingGrid[1][1]);
		this.ghostScatterTargets.set(GhostType.ORANGE, this.pathfindingGrid[1][23]);
		this.ghostScatterTargets.set(GhostType.PINK, this.pathfindingGrid[19][23]);
		this.ghostScatterTargets.set(GhostType.BLUE, this.pathfindingGrid[1][19]);

		console.log("redX = " + this.ghostScatterTargets.get(GhostType.RED).x
		 + " redY = " + this.ghostScatterTargets.get(GhostType.RED).y);

		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				let curr = this.pathfindingGrid[row][col];
				curr.neighbours = this.getNeighboursVonNeumann(curr);
			}
		}
	}

	getNeighboursVonNeumann(spot){
		const dx = [ 1, 0, -1, 0 ];
		const dy = [ 0, 1, 0, -1 ];
		let neighbours = [];
		for(let i = 0; i < 4; ++i){
			let nx = spot.x + dx[i];
			let ny = spot.y + dy[i];
			
			if(ny < 0) ny = this.pathfindingGrid.length - 1;
			if(ny > this.pathfindingGrid.length - 1) ny = 0;

			if(nx < 0) nx = this.pathfindingGrid[0].length - 1;
			if(nx > this.pathfindingGrid[0].length - 1) nx = 0;
			
			//console.log("nx = " + nx + " ny = " + ny);
			if(!this.pathfindingGrid[ny][nx].isWall){
				neighbours.push(this.pathfindingGrid[ny][nx]);	
			}			
		}
		return neighbours;
	}

	getTileType(row, col){
		return this.grid[row][col].type;
	}

	isTilePassable(row, col){
		//console.log("row " + row + " col = " + col);
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