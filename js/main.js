$(document).ready(function(){
	$.getJSON('json/data.json&callback=?', function(result){
		console.log("success");
	});
});
