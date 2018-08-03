class Grid{
	constructor(){
		this.rows = platform.length;
		this.cols = platform[0].length;
		this.grid = createMatrix(this.rows, this.cols);
		this.pathfindingGrid = createMatrix(this.rows, this.cols);
		this.pacmanRespawnX = 0;
		this.pacmanY = 0;
		this.staticEntities = [];
		this.collidedTiles = [];
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col] = platform[row][col];
				let x = col * TILE_SIZE;
				let y = row * TILE_SIZE;
				if(platform[row][col] === 'X'){
					this.grid[row][col] = new Tile(TileType.BRICK, row, col);
					this.pathfindingGrid[row][col] = -1;
				} else if(platform[row][col] === 'o'){
					this.grid[row][col] = new Tile(TileType.POWER_UP, row, col);
					this.pathfindingGrid[row][col] = 0;
				} else if(platform[row][col] === ' ') {
					this.grid[row][col] = new Tile(TileType.FRUIT, row, col);
					this.pathfindingGrid[row][col] = 0;
				} else {
					this.grid[row][col] = new Tile(TileType.EMPTY, row, col);
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

	fixRow(row){
		if(row < 0){
			row = 0;
		}
		if(row > this.rows - 1){
			row = this.rows - 1;
		}
		return row;
	}

	fixColumn(col){
		if(col < 0){
			col = 0;
		}
		if(col > this.cols - 1){
			col = this.cols - 1;
		}
		return col;	
	}

	setTileType(row, col, type){
		this.grid[row][col].type = type;
	}


	getCollidedTiles(entity){
		let minRow = this.fixRow(floor(entity.top() / TILE_SIZE));
		let maxRow = this.fixRow(floor((entity.bottom() - 1) / TILE_SIZE));
		let minCol = this.fixColumn(floor(entity.left() / TILE_SIZE));
		let maxCol = this.fixColumn(floor((entity.right() - 1) / TILE_SIZE));

		this.collidedTiles = [];

		for(let row = minRow; row <= maxRow; ++row){
			for(let col = minCol; col <= maxCol; ++col){
				console.log("row = " + row + " col = " + col)
				this.collidedTiles.push(this.grid[row][col]);
			}
		}

		return this.collidedTiles;
	}

	handleCollisions(entity){
		this.collidedTiles = this.getCollidedTiles(entity);
		for(let i = 0; i < this.collidedTiles.length; ++i){
			let collidedTile = this.collidedTiles[i];
			let distance = dist(entity.x, entity.y, collidedTile.centerX(), collidedTile.centerY());
			let combinedRadius = entity.radius + collidedTile.radius;
			if(distance < combinedRadius){
				if(collidedTile.type === TileType.BRICK){
					if(entity.direction === Direction.NORTH){
						entity.y = collidedTile.bottom() + TILE_SIZE / 2;
					} else if(entity.direction === Direction.SOUTH){
						entity.y = collidedTile.top() - TILE_SIZE + TILE_SIZE / 2;
					} else if(entity.direction === Direction.EAST){
						entity.x = collidedTile.left() - TILE_SIZE + TILE_SIZE / 2;
					} else if(entity.direction === Direction.WEST){
						entity.x = collidedTile.right() + TILE_SIZE / 2;
					}
					entity.setMoving(false);						
				}					
				return true;
			}
		}			
		return false;
	}

	render(){
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.grid[row][col].render();
			}
		}
	}
}