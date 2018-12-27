
function createMatrix(rows, cols){
	let matrix = new Array(rows);
	for(let row = 0; row < matrix.length; ++row){
		matrix[row] = new Array(cols);
	}
	return matrix;
}

function cloneMatrix(matrix){
	if(matrix.length <= 0){
		return [];
	}
	clonedMatrix = createMatrix(matrix.length, matrix[0].length);
	for (let row = 0; row < matrix.length; ++row) {
		for(let col = 0; col < matrix[row].length; ++col){
			clonedMatrix[row][col] = matrix[row][col];
		}
	}
	return clonedMatrix;
}

function getOppositeDirection(direction){
	switch(direction){
		case Direction.EAST:
			return Direction.WEST;
		case Direction.NORTH:
			return Direction.SOUTH;
		case Direction.WEST:
			return Direction.EAST;
		case Direction.SOUTH:
			return Direction.NORTH;
	}
}

function isDirectionVertical(direction){
	return direction === Direction.NORTH || direction === Direction.SOUTH;
}

function isDirectionHorizontal(direction){
	return direction === Direction.EAST || direction === Direction.WEST;	
}