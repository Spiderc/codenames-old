$(document).ready(function(){
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
}

function clearBoard(){
	for(var i=1;i<26;i++){
		$("#tableSection" + (i + 1)).removeClass("red");
		$("#tableSection" + (i + 1)).removeClass("blue");
		$("#tableSection" + (i + 1)).removeClass("bystander");
		$("#tableSection" + (i + 1)).removeClass("assassin");
	}
}

function randomNumber(lowerBound, upperBound){
	return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}