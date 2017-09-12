function main(){
	var day_of_week = moment().tz("Asia/Seoul").format("dddd");
	console.log(day_of_week);
}

main()
