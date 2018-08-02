class Brick extends Entity{
	constructor(x, y){
		super(x, y, 0);
	}

	render(){
		image(imgRock, this.x, this.y);
	}
}