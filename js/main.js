function main(){
  var date = new Date();
  var d = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  console.log(date);
  console.log("Day: " + d);
  console.log("Hour: " + h);
  console.log("Minutes: " + m);
  console.log("Seconds: " + s);
}

main()
