var hexMap = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]

$(document).ready(function(){
	clearBoard();
	$("#boardId").val("");
	
	$("#generateButton").click(function(){
		clearBoard();
		generateBoard();
	});
	$("#importButton").click(function(){
		clearBoard();
		importBoard();
	});
});

function generateBoard(){
	var startingTeam = randomNumber(0,1);
	if(startingTeam === 0){
		$("#startingTeam").text("Red");
		$("#startingTeam").addClass("red");
		$("#startingTeam").removeClass("blue");
	} else {
		$("#startingTeam").text("Blue");
		$("#startingTeam").addClass("blue");
		$("#startingTeam").removeClass("red");
	}
	var array = [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3];
	array.push(startingTeam);
	var board = [];
	for(var i=0;i<25;i++){
		var selectedValue = randomNumber(0, array.length - 1);
		var value = array[selectedValue]
		array.splice(selectedValue, 1);
		if(value === 0){
			$("#tableSection" + (i + 1)).addClass("red");
		} else if(value === 1){
			$("#tableSection" + (i + 1)).addClass("blue");
		} else if(value === 2){
			$("#tableSection" + (i + 1)).addClass("bystander");
		} else if(value === 3){
			$("#tableSection" + (i + 1)).addClass("assassin");
		}
		board.push(value);
	}
	createBoardId(board);
}

function importBoard(){
	var boardId = $("#boardId").val();
	var array = [];
	for(var i=0;i<12;i++){
		var value = hexMap.indexOf(boardId.charAt(i));
		array.push(value >> 2);
		array.push(value & ~12);
	}
	array.push(parseInt(boardId.charAt(12)));
	var redCount = 0;
	for(var i=0;i<25;i++){
		var value = array[i];
		if(value === 0){
			$("#tableSection" + (i + 1)).addClass("red");
			redCount = redCount + 1;
		} else if(value === 1){
			$("#tableSection" + (i + 1)).addClass("blue");
		} else if(value === 2){
			$("#tableSection" + (i + 1)).addClass("bystander");
		} else if(value === 3){
			$("#tableSection" + (i + 1)).addClass("assassin");
		}
	}
	if(redCount === 9){
		$("#startingTeam").text("Red");
		$("#startingTeam").addClass("red");
		$("#startingTeam").removeClass("blue");
	} else {
		$("#startingTeam").text("Blue");
		$("#startingTeam").addClass("blue");
		$("#startingTeam").removeClass("red");
	}
}

function createBoardId(board){
	var boardId = "";
	for(var i=0;i<12;i++){
		var spot1 = board[(2 * i)]
		var spot2 = board[(2 * i) + 1]
		boardId = boardId + hexMap[(spot1 << 2) + spot2];
	}
	boardId = boardId + board[24];
	$("#boardId").val(boardId);
}

function clearBoard(){
	for(var i=0;i<25;i++){
		$("#tableSection" + (i + 1)).removeClass("red");
		$("#tableSection" + (i + 1)).removeClass("blue");
		$("#tableSection" + (i + 1)).removeClass("bystander");
		$("#tableSection" + (i + 1)).removeClass("assassin");
	}
}

function randomNumber(lowerBound, upperBound){
	return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}