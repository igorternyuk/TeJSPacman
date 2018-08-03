
class Tile {
	constructor(type, row, col){
		this.type = type;
		this.row = row;
		this.col = col;
		this.x = this.col * TILE_SIZE;
		this.y = this.row * TILE_SIZE;
		this.radius = type === TileType.FRUIT ? TILE_SIZE / 4 : TILE_SIZE / 2;
	}

	top(){
		return this.y;
	}

	bottom(){
		return this.y + TILE_SIZE;
	}

	left(){
		return this.x;
	}

	right(){
		return this.x + TILE_SIZE;
	}

	centerX(){
		return this.x + this.radius;
	}

	centerY(){
		return this.y + this.radius;
	}

	render(){
		if(this.type !== TileType.EMPTY){
			if(this.type == TileType.FRUIT){
				image(this.type.img, this.x + TILE_SIZE / 4, this.y + TILE_SIZE / 4,
				 TILE_SIZE / 2, TILE_SIZE / 2);	
			} else {
				image(this.type.img, this.x, this.y);		
			}			
		}		
	}
}

