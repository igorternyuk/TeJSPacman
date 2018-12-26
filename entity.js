class Entity{
	constructor(x, y, moveTime, direction){
		this.x = x;
		this.y = y;
		this.moveTime = moveTime;
		this.direction = direction;
		this.isMoving = false;
		this.moveTimer = 0;
	}

	setPosition(x, y){
		this.x = x;
		this.y = y;
	}

	setMoving(moving){
		this.isMoving = moving;	
	}

	fixRow(row){
		if(row < 0) return grid.rows - 1;
		if(row > grid.rows - 1) return 0;
		return row;
	}

	fixCol(col){
		if(col < 0) return grid.cols - 1;
		if(col > grid.cols - 1) return 0;
		return col;
	}

	update(frameTime){
		this.moveTimer += frameTime;
		if(this.moveTimer >= this.moveTime)
		{
			let newX = this.fixCol(this.x + this.direction.dx);
			let newY = this.fixRow(this.y + this.direction.dy);

			if(grid.isTilePassable(newY, newX)){
				this.x = newX;
				this.y = newY;
			} else {
				console.log("We've hit the wall");
			}
			
			this.moveTimer = 0;	
		}		
	}

	render(){

	}
	
}