class Ghost extends Entity{
	consttructor(x,y,direction,type){
		super(x, y, 0.25, direction);
		this.isScared = false;
	}
}