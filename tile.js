
class Tile {
	constructor(type, x, y){
		this.type = type;
		this.x = x;
		this.y = y;
		this.radius = TILE_SIZE / 2;
	}

	render(){
		if(this.type !== TileType.EMPTY){
			image(this.type.img, this.x, this.y);	
		}		
	}
}

