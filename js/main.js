$(document).ready(function(){
	var obj = $.getJSON('json/data.json&callback=?', function(result){
		console.log(result);
	});
});
