class PathFinder {
	constructor(){
		this.grid = grid.pathfindingGrid;
		this.openSet = new PriorityQueue((a, b) => a.f < b.f );
		this.closedSet = [];
		this.optimalPath = [];
	}

	reset(){
		for(let row = 0; row < grid.rows; ++row){
			for(let col = 0; col < grid.cols; ++col){
				this.grid[row][col].f = 0;
				this.grid[row][col].cost = 0;		
				this.grid[row][col].heuristic = 0;	
				this.grid[row][col].prev = null;
			}
		}
		this.openSet = [];
		this.openSet = new PriorityQueue((a, b) => a.f < b.f );
		this.closedSet = [];
		this.optimalPath = [];
	}

	calcShortestPath(startX, startY, targetX, targetY){

		this.reset();

		console.log("Pathfinder started with startX = " + startX + " startY = " + startY + " targetX = " + targetX + " targetY = " + targetY);
		
		let start = this.grid[startY][startX];
		let target = this.grid[targetY][targetX];
		let pathFound = false;

		this.openSet.push(start);

		while(!this.openSet.isEmpty()){
			
			let current = this.openSet.pop();

			if(current === target){
				console.log("Done!");
				pathFound = true;		
			}

			this.closedSet.push(current);
			let neighbours = current.neighbours;
			neighbours.forEach(neighbour => {
				if(!this.closedSet.includes(neighbour)){
					var tmpCost = current.cost + 1;
					if(this.openSet.includes(neighbour)){
						if(tmpCost < neighbour.cost){
							neighbour.cost = tmpCost;
							neighbour.f = neighbour.cost + neighbour.heuristic;
							neighbour.prev = current;
						}
					} else {
						neighbour.cost = tmpCost;
						neighbour.heuristic = this.heuristicFunc(neighbour, target);
						neighbour.f = neighbour.cost + neighbour.heuristic;
						neighbour.prev = current;
						this.openSet.push(neighbour);					
					}
				}		
			});	

			
			this.openSet.heapify();
		}
		let optimalPath = [];
		if(pathFound){
			optimalPath = this.restoreOptimalPath(start, target);
			console.log("Solution was found");
		}
		else {
			console.log("No solution!");
		}
		return optimalPath;
	}

	restoreOptimalPath(start, target){
		let optimalPath = [];
		let curr = target;
		optimalPath.push(curr);
		while(curr.prev != null && curr.prev != start){
			optimalPath.push(curr.prev);
			curr = curr.prev;
		}
		return optimalPath.reverse();
	}

	heuristicFunc(begin, end){
		return abs(begin.x - end.x) + abs(begin.y - end.y);
	}

	isValidCoordinates(x, y){
		return y >= 0 && y < this.grid.length && x >= 0
		 && x < this.grid[y].length;
	}
}