//$(document).ready(function(){
//	console.log("hello");
//});
/*$.getJSON('json/data.json', function(data){
	
	
});*/

var facility_names = [];
var facility_arr = null;

$.ajax({
	url: 'json/data.json',
	dataType: 'json',
	type: 'get',
	cache: true,
	success: function(data){
		facility_arr = data;
		for(var i = 0; i < data.length; i++){
			facility_names.push(data[i].title);
		}
	}
});

//@param: the name of facility
//@return: the index of facility that was found by name in data
//In case of not finding it returns -1
function facility_index_by_name(facility_name){
	for(var i = 0; i < facility_arr.length; i++){
		if(facility_arr[i].title == facility_name){
			return i;
		}
	}
	return -1;
}

function show_countdown(time_interval, is_facility_open){
	var cd_days = parseInt(time_interval / 24 / 60 / 60);
	time_interval -= cd_days * 24 * 60 * 60;
	var cd_hours = parseInt(time_interval / 60 / 60);
	time_interval -= cd_hours * 60 * 60;
	var cd_minutes = parseInt(time_interval / 60);
	time_interval -= cd_minutes * 60;
	var cd_seconds = time_interval;
	$('#countdown').text(cd_days + "d" + cd_hours + "h" + cd_minutes + "m" + cd_seconds + "s till " + (is_facility_open ? "closing" : "opening"));
}

$(document).ready(function(){
	for(var i = 0; i < facility_names.length; i++){
		$(".selection").append("<option>"+facility_names[i]+"</option>");
	}
	var now = moment().tz("Asia/Seoul");
	//var now = moment("2017-09-21 23:00", "YYYY-MM-DD HH:mm");
	var day_of_week = now.format("E") - 1;//As the function returns the value in range 1..7
	$(".select-button").click(function(){
		var name = $('.selection>option:selected').text();
		var id = facility_index_by_name(name);
		var tmp = facility_arr[id].hours[day_of_week];
		tmp = tmp[Object.keys(tmp)[0]];
		var is_facility_open = false;
		var len = tmp.length;
		var time_interval = 0;//measured in seconds
		//
		for(var i = 0; i < len; ++i){
			if(now.diff(moment(tmp[i].start, 'HH:mm')) >= 0 && 
			now.diff(moment(tmp[i].finish, 'HH:mm')) <= 0){
				is_facility_open = true;
				time_interval = -now.diff(moment(tmp[i].finish, 'HH:mm'), 'seconds');
			}
		}
		//
		if(is_facility_open){
			$('#indicator').text("The " + name + " is open now.");
		}
		else {
			var i;
			for(i = len - 1; i >= 0; --i){
				if(now.diff(moment(tmp[i].finish, 'HH:mm')) > 0){
					break;
				}
			}
			if(i == -1){
				time_interval = -now.diff(moment(tmp[0].start, 'HH:mm'), 'seconds');
			} else if (i != len - 1){
				time_interval = -now.diff(moment(tmp[i + 1].start, 'HH:mm'), 'seconds');
			} else {
				var next_day = day_of_week;
				var then = now.clone();
				var i;
				for(i = 0; i < 8; ++i){
					next_day = parseInt((next_day + 1) % 7);
					then = then.add(1, 'days');
					then = then.startOf('day');
					var tmp1 = facility_arr[id].hours[next_day];
					tmp1 = tmp1[Object.keys(tmp1)[0]];
					if(tmp1.length != 0){
						then = then.add(moment(tmp1[0].start, "HH:mm").hours(), 'h');
						then = then.add(moment(tmp1[0].start, "HH:mm").minutes(), 'm');
						time_interval = -now.diff(then, 'seconds');
						break;
					}
				}
				if(i == 8){
					alert("Something went wrong, it seems that facility working hours are unspecified or the data associated with it doesn't exist");
				}
			}
			$("#indicator").text("The " + name + " is closed now.");
		}		
		setInterval(function(){show_countdown(time_interval, is_facility_open);time_interval--;}, 1000);
	});
});



