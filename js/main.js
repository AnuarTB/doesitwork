(function(main){
	main(window.jQuery, window, document);	
	
	}(function($, window, document){
		let listLoad = new Promise(function(resolve, reject){	
			$.ajax({
				url: 'json/list.json',
				dataType: 'json',
				cache: true,
				success: resolve,
				error: reject
			});
		});
		
		listLoad.then(function(fac_arr){
			$(function(){
				$('#clock').hide();
				for(let i = 0; i < fac_arr.length; i++){
					$(".selection").append("<option value="+fac_arr[i].file+">"+fac_arr[i].title+"</option>");
				}
				let now = moment().tz("Asia/Seoul");
				let day_of_week = now.format("E") - 1;
				//As the function returns the value in range 1..7
				$(".select-button").click(function(){
					let fileUrl = $('.selection>option:selected').val();
					let loadFacilityInfo = new Promise(function(resolve, reject){
						$.ajax({
							url: "json/" + fileUrl,
							dataType: 'json',
							cache: true,
							success: resolve,
							error: reject
						});
					});
					loadFacilityInfo.then(function(facility_info){
						let name = $('.selection>option:selected').text();
						let tmp = facility_info.hours[day_of_week];
						tmp = tmp[Object.keys(tmp)[0]];
						let is_facility_open = false;
						let len = tmp.length;
						let time_interval = 0;//measured in seconds
						//
						let show_countdown = function(time_interval, is_facility_open){
							if(time_interval < 0)
								location.reload();
							var duration = moment.duration(time_interval, 'seconds');
							$('#days').html(duration.days());
							$('#hours').html(duration.hours());
							$('#minutes').html(duration.minutes());
							$('#seconds').html(duration.seconds());
						}
						//
						for(let i = 0; i < len; ++i){
							if(now.diff(moment(tmp[i].start, 'HH:mm')) >= 0 && 
							now.diff(moment(tmp[i].finish, 'HH:mm')) <= 0){
								is_facility_open = true;
								time_interval = -now.diff(moment(tmp[i].finish, 'HH:mm'), 'seconds');
							}
						}
						//
						if(is_facility_open){
							$('#indicator').html("The <strong>" + name + "</strong> is <strong>open</strong> now.");
							$('#subindicator').html("<h1>Till <strong>closing</strong></h1>");
						}
						else {
							let i;
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
								let next_day = day_of_week;
								let then = now.clone();
								let i;
								for(i = 0; i < 8; ++i){
									next_day = parseInt((next_day + 1) % 7);
									then = then.add(1, 'days');
									then = then.startOf('day');
									let tmp1 = facility_arr[id].hours[next_day];
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
							$('#indicator').html("The <strong>" + name + "</strong> is <strong>closed</strong> now.");
							$('#subindicator').html("Till <strong>opening</strong>");
						}		
						$('#clock').slideDown();
						setInterval(function(){show_countdown(time_interval, is_facility_open);time_interval--;}, 1000);
					});
					loadFacilityInfo.catch(function(err){
						alert("Something went wrong :( Sorry for inconvinience.");
						console.log("In promise loadFacilityInfo");
						console.log(err);
					});
				});
			});
		});
		
		listLoad.catch(function(err){
			alert("Something went wrong :( Sorry for inconvinience.");
			console.log("In promise listLoad");
			console.log(err);
		});
		
		//The global functions that doesn't depend on DOM
		
	}
));


