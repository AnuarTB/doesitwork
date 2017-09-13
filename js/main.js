$(document).ready(function(){
	var obj = $.getJSON('json/data.json&callback=?', function(result){
		$.each(result, function(i, field){
			$('div').append(field + ' ');
		});
	});
});
