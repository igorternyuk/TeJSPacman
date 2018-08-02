
function createMatrix(rows, cols){
	let matrix = new Array(rows);
	for(let row = 0; row < matrix.length; ++row){
		matrix[row] = new Array(cols);
	}
	return matrix;
}

function cloneMatrix(matrix){
	if(matrix.size() <= 0){
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
