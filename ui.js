var compass = new Compass(cameraControler, document.getElementById("stats_compass"));
var updateLoop = setInterval(updateUI, 1000);

function updateUI() {
	stats.update();
	compass.update();
}