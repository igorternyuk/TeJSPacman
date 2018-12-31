class Ghost extends Entity{
	constructor(x,y,direction,type){
		super(x, y, 0.7, direction);
		this.isEaten;
		this.type = type;
		this.mode = GhostMode.IN_BOX;
		this.currFrame = 0;
		this.numFrames = 2;
		this.frameTimer = 0;
		this.animationSpeed = 0.2;
		this.sourceX = this.type * 2 * TILE_SIZE;
		this.sourceY = direction.index * TILE_SIZE;
		this.shortestPath = [];
		this.currPosOnPath = 0;
		this.target = grid.pathfindingGrid[pacman.y][pacman.x];
		this.modeTimer = 0;
		this.modeChangePeriod = 20;
	}

	getEaten(){
		this.mode = GhostMode.GOING_HOME;
		this.isEaten = true;
		this.moveTimer = 0;
		this.modeTimer = 0;
		this.shortestPath = [];
		this.currPosOnPath = 0;
	}

	scare(){
		this.mode = GhostMode.SCARED;
		let rd = floor(random(AllDirections.length));
		let randDir = AllDirections[rd];
		this.direction = randDir;
	}

	goToBox(){
		let initPos = grid.ghostPositions.get(this.type);
		this.setPosition(initPos.x, initPos.y);
		this.mode = GhostMode.IN_BOX;
		this.isEaten = true;
		this.moveTimer = 0;
		this.modeTimer = 0;
		this.shortestPath = [];
		this.currPosOnPath = 0;
	}

	isScared(){
		return this.mode === GhostMode.SCARED;
	}

	update(frameTime){
		this.frameTimer += frameTime;
		if(this.frameTimer >= this.animationSpeed){
			++this.currFrame;
			if(this.currFrame >= this.numFrames){
				this.currFrame = 0;
			}
			this.frameTimer = 0;

			this.sourceX = this.type * 2 * TILE_SIZE + this.currFrame * TILE_SIZE;
			this.sourceY = this.direction.index * TILE_SIZE;


			if(this.isScared()){
				this.sourceX = 6 * 2 * TILE_SIZE + this.currFrame * TILE_SIZE;
				this.sourceY = 0;
			}

			if(this.isEaten){
				this.sourceX = 6 * 2 * TILE_SIZE + this.currFrame * TILE_SIZE;
				this.sourceY = 2 * TILE_SIZE;
			}
		}

		this.modeTimer += frameTime;
		if(this.modeTimer >= this.modeChangePeriod){
			if(this.mode === GhostMode.SCATTER){
				this.mode = GhostMode.CHASE;
			} else if(this.mode === GhostMode.CHASE || this.mode === GhostMode.SCARED){
				this.mode = GhostMode.SCATTER;
			}
			this.modeTimer = 0;
		}

		this.moveTimer += frameTime;

		if(this.mode === GhostMode.IN_BOX){
			if(this.moveTimer >= (this.type + 1) * 5){
				this.isEaten = false;
				let leavingPoint = grid.ghostLeavingPoints.get(this.type);
				this.setPosition(leavingPoint.x,leavingPoint.y);
				this.mode = GhostMode.SCATTER;
				this.shortestPath = [];
			}

		} else if(this.mode === GhostMode.SCARED){
			if(this.moveTimer >= this.moveTime){
				if(!this.tryToMove()){
					let neighbours = grid.pathfindingGrid[this.y][this.x].neighbours;
					let randIndex = floor(random(neighbours.length));
					let randNeighbour = neighbours[randIndex];
					this.setPosition(randNeighbour.x, randNeighbour.y);
				}
				this.moveTimer = 0;
			}
			
		} else if(this.mode === GhostMode.SCATTER){			

			if(this.moveTimer >= this.moveTime){
				if(this.shortestPath.length === 0){
					this.target = grid.ghostScatterTargets.get(this.type);
					if(this.type === GhostType.RED){
						console.log("this.target.x = " + this.target.x + " this.target.y = " + this.target.y);
					}


					this.shortestPath =
					 pathfinder.calcShortestPath(this.x, this.y, this.target.x, this.target.y);
					 this.currPosOnPath = 0;
				}
				
				if(this.x === this.target.x && this.y === this.target.y){
					console.log("Target reached. Switching to chasing");
					this.mode = GhostMode.CHASE;
					this.shortestPath = [];
					this.currPosOnPath = 0;
				} else {					
					++this.currPosOnPath;
					if(this.currPosOnPath < this.shortestPath.length){
						let nextPos = this.shortestPath[this.currPosOnPath];
						this.setPosition(nextPos.x, nextPos.y);
					} else {
						this.shortestPath = [];
						this.currPosOnPath = 0;
					}
				}
				this.moveTimer = 0; 
			}
			
		} else if(this.mode === GhostMode.GOING_HOME){			

			if(this.moveTimer >= this.moveTime){
				if(this.shortestPath.length === 0){
					this.target = grid.ghostLeavingPoints.get(this.type);
					this.shortestPath =
					 pathfinder.calcShortestPath(this.x, this.y, this.target.x, this.target.y);
					 this.currPosOnPath = 0;
					 console.log("Eyes's path calculated. Its size = " + this.shortestPath.length);
				}
				
				if(this.x === this.target.x && this.y === this.target.y){
					console.log("Going back into the box");
					this.goToBox();
				} else {
					++this.currPosOnPath;
					if(this.currPosOnPath < this.shortestPath.length){
						let nextPos = this.shortestPath[this.currPosOnPath];
						this.setPosition(nextPos.x, nextPos.y);
					} else {
						this.shortestPath = [];
						this.currPosOnPath = 0;
					}
				}
				this.moveTimer = 0; 
			}
			
		} else if(this.mode === GhostMode.CHASE){
			if(this.moveTimer >= this.moveTime){
				if(this.type === GhostType.ORANGE && this.distanceTo(pacman) < 8){
					this.target = grid.pathfindingGrid[1][1];
				} else {
					this.target = grid.pathfindingGrid[pacman.y][pacman.x];
				}
				this.shortestPath =
				 pathfinder.calcShortestPath(this.x, this.y, this.target.x, this.target.y);
				
				if(this.x === this.target.x && this.y === this.target.y){
					console.log("Target reached. Switching to chasing");
					this.mode = GhostMode.SCATTER;
					this.shortestPath = [];
					this.currPosOnPath = 0;
				} else {
					if(this.shortestPath.length > 0){
						let nextPos = this.shortestPath[0];
						this.setPosition(nextPos.x, nextPos.y);
					} else {
						this.mode = GhostMode.SCATTER;
					}
					
				}
				this.moveTimer = 0;
			}
		}
	}

	render(){
		image(imgGhosts, this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE,
		 this.sourceX, this.sourceY, TILE_SIZE, TILE_SIZE);

		/*for(let i = this.shortestPath.length - 1; i > 0; --i){
			strokeWeight(2);
			if(this.type === GhostType.RED){
				stroke(255,0,0);
			} else if(this.type === GhostType.ORANGE){
				stroke(255,79,0);
			} else if(this.type === GhostType.BLUE){
				stroke(0,255,255);
			} else if(this.type === GhostType.PINK){
				stroke(233,0,255);
			}
			line(this.shortestPath[i].x * TILE_SIZE + TILE_SIZE / 2,
			 	 this.shortestPath[i].y * TILE_SIZE + TILE_SIZE / 2,
			     this.shortestPath[i - 1].x * TILE_SIZE + TILE_SIZE / 2,
			     this.shortestPath[i - 1].y * TILE_SIZE + TILE_SIZE / 2);
			strokeWeight(1);
		}*/
	}
}