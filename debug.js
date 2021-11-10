function toggleDebug() {
	debug = (!debug);
	if (debug) {
		showDebug();
	} else {
		hideDebug();
	}
	debugChanged = true;
}

function showDebug() {
	// Show the Stats module
	stats.show();
	document.getElementsByClassName("bar-left")[0].style.display = "block";
	document.getElementsByClassName("bar-left")[0].style.zIndex = 101;
	// Add playerCenterRay
	scene.add(playerCenterRay);
	// Show wireframes
	for (var i = 0; i < terrain.length; i++) {
		scene.add(terrain[i].wireframe);
	}
	// Create Block Debug lines
	for (var i = 0; i < terrain.length; i++) {
		var material = new THREE.LineBasicMaterial({
			color: 0x00ff00
		});
		var points = [];
		if (terrain[i].cube.position.x % 10 == 0 && terrain[i].cube.position.z % 10 == 0) {
			points.push(new THREE.Vector3(terrain[i].cube.position.x, -10, terrain[i].cube.position.z));
			points.push(new THREE.Vector3(terrain[i].cube.position.x, 10, terrain[i].cube.position.z));
			var geometry = new THREE.BufferGeometry();
			geometry.setFromPoints(points);
			var line = new THREE.Line(geometry, material);
			debugLines.push(line);
			scene.add(line);
		}
	}
}

function hideDebug() {
	// Hide stats
	stats.hide();
	document.getElementsByClassName("bar-left")[0].style.display = "none";
	document.getElementsByClassName("bar-left")[0].style.zIndex = -1;
	// Remove playerCenterRay
	scene.remove(playerCenterRay);
	// Hide wireframes
	for (var i = 0; i < terrain.length; i++) {
		scene.remove(terrain[i].wireframe);
	}
	// Remove Block Debug lines
	var length = debugLines.length;
	for (var i = 0; i < length; i++) {
		scene.remove(debugLines[0]);
		debugLines.shift();
	}
}