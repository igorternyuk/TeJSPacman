var canvasWidth = 400;
var canvasHeight = 400;
var rowCount = 50;
var colCount = 50;
var spotWidth, spotHeight;

var grid = createMatrix(rowCount, colCount);
var openSet;
var closedSet = [];

var start;
var target;
var optimalPath = [];
var considerDiagonals = false;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(60);
    createRandomMaze();
	openSet = new PriorityQueue((a, b) => a.f < b.f );
    openSet.push(start);
}

function createRandomMaze(){
	spotHeight = height / rowCount;
    spotWidth = width / colCount;
    console.log("spotHeight = ", spotHeight);
    console.log("spotWidth = ", spotWidth);
    createMatrix(rowCount, colCount);

    for(let y = 0; y < grid.length; ++y){
  	  for(let x = 0; x < grid[y].length; ++x){
  	  	  let rnd = random();
  		  grid[y][x] = new Spot(x,y, rnd < 0.2);
  	  }
    }

    start = grid[0][0];
    start.isWall = false;
    target = grid[rowCount - 1][colCount - 1];
    target.isWall = false;
}

function restoreOptimalPath(current){
	optimalPath = [];
	let curr = current;
	optimalPath.push(curr);
	while(curr.prev != null){
		optimalPath.push(curr.prev);
		curr = curr.prev;
	}
	//console.log("optimalPath.length = " + optimalPath.length);
}

//main loop
function draw() {
	background(255);

	if(!openSet.isEmpty()){
		let current = openSet.pop();

		if(current === target){
			console.log("Done!");		
			noLoop();
		}

		closedSet.push(current);
		//console.log("current spot x = " + current.x + " y = " + current.y);
		//console.log("--------------------------");
		//console.log("neighbours.length = " + neighbours.length);
		//let neighbours = current.getNeighboursVonNeumann(grid);
		let neighbours = considerDiagonals
						 ? current.getNeighboursMoor(grid)
						 : current.getNeighboursVonNeumann(grid);
		neighbours.forEach(neighbour => {
			if(!closedSet.includes(neighbour)){
				//console.log("currNeighbour x = " + neighbour.x + " y = " + neighbour.y);
				var tmpCost = current.cost + 1;
				if(openSet.includes(neighbour)){
					if(tmpCost < neighbour.cost){
						neighbour.cost = tmpCost;
						neighbour.f = neighbour.cost + neighbour.heuristic;
						neighbour.prev = current;
						//console.log("improving cost");
					}
				} else {
					neighbour.cost = tmpCost;
					neighbour.heuristic = heuristicFunc(neighbour, target);
					neighbour.f = neighbour.cost + neighbour.heuristic;
					neighbour.prev = current;
					openSet.push(neighbour);					
				}
			}		
		});	

		restoreOptimalPath(current);
		openSet.heapify();
		//console.log("--------------------------");		

	} else {
		console.log("No solution!");
		noLoop();
	}

	//Rendering

	for(let y = 0; y < grid.length; ++y){
	  	for(let x = 0; x < grid[y].length; ++x){
	  		if(openSet.includes(grid[y][x])){
	  			grid[y][x].render(color(0,230,0));
	  		} else if(closedSet.includes(grid[y][x])){
	  			//console.log("p = " + floor(grid[y][x].f));
  				grid[y][x].render(color(255,0,0));
	  		} else {
	  			if(grid[y][x].isWall){
	  				grid[y][x].render(color(0));
	  			} /*else {
	  				grid[y][x].render(color(30));	
	  			}*/
	  			
	  		}
	  		
	  	}
  	}

  	noFill();
  	stroke(0,0,255);
  	strokeWeight((spotWidth + spotHeight) / 4);

  	beginShape();
  	optimalPath.forEach(spot => {
  		vertex(spot.x * spotWidth + spotWidth / 2,
  		     spot.y * spotHeight + spotHeight / 2);
  	});
  	endShape();

  	/*optimalPath.forEach(spot => {
  		spot.render(color(0,0,255));
  	});*/
}

function heuristicFunc(begin, end){
	return abs(begin.x - end.x) + abs(begin.y - end.y);
	/*return considerDiagonals ? dist(start.x, start.y, target.x, target.y) 
	                         : abs(begin.x - end.x) + abs(begin.y - end.y);*/
}

function createMatrix(rows, cols){
	let grid = new Array(rows);
	for(let i = 0; i < grid.length; ++i){
		grid[i] = new Array(cols);
	}
	return grid;
}

function isValidCoordinates(grid, x, y){
	return y >= 0 && y < grid.length && x >= 0
	 && x < grid[y].length;
}


