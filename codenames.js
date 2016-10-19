var hexMap = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]

$(document).ready(function(){
	clearBoard();
	clearWords();
	$("#boardId").val("");
	$("#words").val("");
	$("#codeMasterColor").val("");
	$("#starting").val("");
	
	$.get("words.json", {}, function(data){
		var setsString = "";
		for(key in data){
			setsString = setsString + "<input class='checkbox' type='checkbox' id='"+key+"' name='"+key+"'";
			if(key === "Base"){
				setsString = setsString + " checked";
			}
			setsString = setsString + "><label for='"+key+"'>"+key+"</label>";
		}
		$("#setArea").html(setsString);
	}, "json");
	
	$("#generateButton").click(function(){
		clearBoard();
		generateBoard();
		$("#generateButton").hide();
		$("#importButton").hide();
		$("#codeMasterColorContainer").show();
		$(".playerColor").hide();
		$("#color").append("<option value='codemaster'>Codemaster</option>");
		$("#color").val("codemaster");
	});
	$("#importButton").click(function(){
		clearBoard();
		importBoard();
		$("#generateButton").hide();
		$("#boardId").hide();
		$("#importButton").hide();
		$("#color").hide();
		$("#codeMasterColorContainer").show();
		$(".playerColor").hide();
		$("#color").append("<option value='codemaster'>Codemaster</option>");
		$("#color").val("codemaster");
	});
	$("#generateWords").click(function(){
		clearWords();
		getWords();
		$("#setArea").hide();
		$("#generateWords").hide();
		$("#importWordsButton").hide();
	});
	$("#importWordsButton").click(function(){
		clearWords();
		importWords();
		$("#setArea").hide();
		$("#generateWords").hide();
		$("#words").hide();
		$("#importWordsButton").hide();
	});
	$(".word").click(function(){
		var id = $(this)[0].id.substring(2, $(this)[0].id.length);
		$("#word"+id).parent().removeClass("blue");
		$("#word"+id).parent().removeClass("red");
		$("#word"+id).parent().removeClass("bystander");
		$("#word"+id).parent().removeClass("assassin");
		if($("#color").val() == ""){
			$("#word"+id).show();
		} else {
			$("#word"+id).toggle();
			$("#word"+id).parent().addClass($("#color").val());
			$(this).addClass($("#tableSection"+id)[0]["classList"][1]);
		}
		updateCurrent();
	});
	$("#codeMasterColor").change(function(){
		for(var i=1;i<26;i++){
			$("#td"+i).removeClass("bold");
			if($("#tableSection"+i)[0]["classList"][1] === $("#codeMasterColor").val()){
				$("#td"+i).addClass("bold");
			}
		}
	});
	$("#starting").change(function(){
		updateStartingTotals();
	});
});

function generateBoard(){
	var startingTeam = randomNumber(0,1);
	if(startingTeam === 0){
		$("#startingTeam").text("Red");
		$("#startingTeam").addClass("red");
		$("#startingTeam").removeClass("blue");
		$("#starting").val("red");
	} else {
		$("#startingTeam").text("Blue");
		$("#startingTeam").addClass("blue");
		$("#startingTeam").removeClass("red");
		$("#starting").val("blue");
	}
	updateStartingTotals();
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

function clearWords(){
	for(var i=0;i<25;i++){
		$("#td" + (i + 1)).removeClass("red");
		$("#td" + (i + 1)).removeClass("blue");
		$("#td" + (i + 1)).removeClass("bystander");
		$("#td" + (i + 1)).removeClass("assassin");
		$("#word" + (i + 1)).show();
		$("#word" + (i + 1)).text("");
	}
}

function getWords(){
	var setList = [];
	$(".checkbox").each(function(){
		if($(this.checked)[0]){
			setList.push($(this)[0].id);
		}
	});
	if(setList.length > 0){
		var wordList = [];
		$.get("words.json", {}, function(data){
			for(key in data){
				if(setList.indexOf(key) > -1){
					for(i in data[key]){
						wordList.push(data[key][i]["word"]);
					}
				}
			}
			generateWordTable(wordList);
		}, "json");
	}
}

function generateWordTable(wordList){
	var words = "";
	for(var i=0;i<25;i++){
		var wordNumber = randomNumber(0, wordList.length - 1);
		$("#word"+(i + 1)).text(wordList[wordNumber]);
		words = words + wordList[wordNumber] + "|";
		wordList.splice(wordNumber, 1);
	}
	$("#words").val(words);
}

function importWords(){
	var wordArray = $("#words").val().split("|");
	for(var i=0;i<25;i++){
		$("#word"+(i + 1)).text(wordArray[i]);
	}
}

function updateStartingTotals(){
	if($("#starting").val() == "blue"){
		$("#totalBlue").text("9");
		$("#totalRed").text("8");
	} else if($("#starting").val() == "red"){
		$("#totalBlue").text("8");
		$("#totalRed").text("9");
	} else {
		$("#totalBlue").text("8");
		$("#totalRed").text("8");
	}
}

function updateCurrent(){
	var currentBlue = 0;
	var currentRed = 0;
	var currentBystander = 0;
	var currentAssassin = 0;
	$("#wordsTable .blue").each(function(){
		currentBlue = currentBlue + 1;
	});
	$("#wordsTable .red").each(function(){
		currentRed = currentRed + 1;
	});
	$("#wordsTable .bystander").each(function(){
		currentBystander = currentBystander + 1;
	});
	$("#wordsTable .assassin").each(function(){
		currentAssassin = currentAssassin + 1;
	});
	$("#currentBlue").text(currentBlue);
	$("#currentRed").text(currentRed);
	$("#currentBystander").text(currentBystander);
	$("#currentAssassin").text(currentAssassin);
}

function randomNumber(lowerBound, upperBound){
	return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}