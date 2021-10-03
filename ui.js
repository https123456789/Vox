var compass = new Compass(cameraControler, document.getElementById("compass"));
var updateLoop = setInterval(updateUI, 100);

function updateUI() {
	compass.update();
}