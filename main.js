var stats = new GameStats();
/*var stats = new Stats();
document.body.appendChild(stats.dom);
stats.dom.style.display = "none";*/
// Setup three.js
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ffff);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 5, 10);
var lightTarget = new THREE.Object3D();
lightTarget.position.set(0, 0, 0);
light.target = lightTarget;
scene.add(light);
var globalLight = new THREE.AmbientLight();
scene.add(globalLight);
var playerCenterRay;
// Global variables
var debug = false;
var debugLines = [];
var jumping = false;
var GRAVITY = -1;
var WORLD_WIDTH = 20;
var WORLD_LENGTH = 20;
var terrain = [];
var keys = {
	"ArrowLeft": false,
	"ArrowRight": false,
	"w": false,
	"s": false,
	"a": false,
	"d": false,
	"Space": false
}
var cameraControler = new CameraControler(camera);
var keyDownListener = window.addEventListener("keydown", handleKeyDown);
var keyUpListener = window.addEventListener("keyup", handleKeyUp);
for (var x = 0; x < WORLD_WIDTH; x++) {
	for (var z = 0; z < WORLD_LENGTH; z++) {
		var geometry = new THREE.BoxGeometry();
		var materials = [
			new THREE.MeshLambertMaterial({color: 0xf0f0f0})
		];
		//geometry.groups[0].materialIndex = 1;
		var wireframe = new THREE.WireframeGeometry(geometry);
		var lines = new THREE.LineSegments(wireframe);
		var material;
		var cube = new THREE.Mesh(geometry, materials[0]);
		cube.position.x = x;
		cube.position.z = z;
		lines.position.x = x;
		lines.position.z = z;
		var tcube = new TCube(cube, lines, type = "unknown");
		terrain.push(tcube);
	}
}
for (var i = 0; i < terrain.length; i++) {
	terrain[i].addToScene(scene);
}
terrain[32].setY(1);
terrain[33].setY(1);
terrain[42].setY(1);
terrain[43].setY(1);
var g = new THREE.BoxGeometry(1, 1, 1);
var mats = [
	/* South */
	new THREE.MeshBasicMaterial({color: 0xff0000}),
	/* North */
	new THREE.MeshBasicMaterial({color: 0xffff00}),
	/* Top */
	new THREE.MeshBasicMaterial({color: 0x00ff00}),
	/* Bottom */
	new THREE.MeshBasicMaterial({color: 0xffffff}),
	/* East */
	new THREE.MeshBasicMaterial({color: 0x0000ff}),
	/* West */
	new THREE.MeshBasicMaterial({color: 0x000000})
];
var mesh = new THREE.Mesh(g, mats);
mesh.position.x = 15;
mesh.position.z = 15;
//scene.add(mesh);

function generateChunk() {
	var chunk = [];
	for (var x = 0; x < WORLD_WIDTH; x++) {
		for (var z = 0; z < WORLD_LENGTH; z++) {
			var geometry = new THREE.BoxGeometry();
			var wireframe = new THREE.WireframeGeometry(geometry);
			var lines = new THREE.LineSegments(wireframe);
			var material;
			material = new THREE.MeshBasicMaterial({
				color: "rgb(" + x*10 + ", " + z*10 + ", " + z*10 + ")"
			});
			var cube = new THREE.Mesh(geometry, material);
			cube.position.x = x;
			cube.position.z = z;
			lines.position.x = x;
			lines.position.z = z;
			var tcube = new TCube(cube, lines);
			chunk.push(tcube);
		}
	}
	for (var i = 0; i < terrain.length; i++) {
		chunk[i].addToScene(scene);
	}
	terrain = chunk;
}

// Key event handlers
function handleKeyDown(e) {
	switch (e.key) {
		case "ArrowRight":
			keys.ArrowRight = true;
			break;
		case "ArrowLeft":
			keys.ArrowLeft = true;
			break;
		case "w":
			keys.w = true;
			break;
		case "s":
			keys.s = true;
			break;
		case "a":
			keys.a = true;
			break;
		case "d":
			keys.d = true;
			break;
		case " ":
			keys.Space = true;
			break;
	}
}
function handleKeyUp(e) {
	switch (e.key) {
		case "ArrowRight":
			keys.ArrowRight = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft = false;
			break;
		case "w":
			keys.w = false;
			break;
		case "s":
			keys.s = false;
			break;
		case "a":
			keys.a = false;
			break;
		case "d":
			keys.d = false;
			break;
		case " ":
			keys.Space = false;
			break;
	}
}
function handleInput() {
	if (keys.ArrowRight) {
		cameraControler.rotateY(-0.1);
	}
	if (keys.ArrowLeft) {
		cameraControler.rotateY(0.1);
	}
	if (keys.w) {
		var vec = new THREE.Vector3();
		camera.getWorldDirection(vec);
		camera.position.addScaledVector(vec, 0.1);
	}
	if (keys.s) {
		var vec = new THREE.Vector3();
		camera.getWorldDirection(vec);
		camera.position.addScaledVector(vec, -0.1);
	}
	if (keys.a) {
		var vec = new THREE.Vector3();
		camera.getWorldDirection(vec);
	}
	if (keys.d) {
		var vec = new THREE.Vector3();
		camera.getWorldDirection(vec);
	}
	if (keys.Space) {
		var c = checkForPlayerCollision();
		if (c) {
			cameraControler.setY(-(GRAVITY), add = 1);
			jumping = true;
		}
	} else {
		jumping = false;
		var c = checkForPlayerCollision();
		if (!c) {
			if (camera.position.y > 1) {
				cameraControler.setY(GRAVITY, add = 1);
			}
		}
	}
}

function checkForPlayerCollision(debug = 0) {
	for (var i = 0; i < terrain.length; i++) {
		var cubeObj = terrain[i].cube;
		var x = camera.position.x;
		var z = camera.position.z;
		var y = Math.floor(camera.position.y);
		if (debug == 1) {
			console.log(y);
		}
		var xon = false;
		var zon = false;
		var yon = false;
		var sideon = false;
		var cubeBounds = {
			"x": {
				"max": cubeObj.position.x + 0.5,
				"min": cubeObj.position.x - 0.5
			},
			"z": {
				"max": cubeObj.position.z + 0.5,
				"min": cubeObj.position.z - 0.5
			},
			"y": {
				"max": cubeObj.position.y,
				"min": cubeObj.position.y - 1
			}
		}
		if (x > (cubeObj.position.x - 0.5) && x < (cubeObj.position.x + 0.5)) {
			xon = true;
		}
		if (z > (cubeObj.position.z - 0.5) && z < (cubeObj.position.z + 0.5)) {
			zon = true;
		}
		if (Math.floor(y - 1) == cubeObj.position.y) {
			yon = true;
		}
		if (xon && zon && !yon && !jumping) {
			var rot = camera.rotation.y;
			if (rot >= 3) {
				var vec = new THREE.Vector3();
				camera.getWorldDirection(vec);
				camera.position.addScaledVector(vec, 0.1);
			} else {
				var vec = new THREE.Vector3();
				camera.getWorldDirection(vec);
				camera.position.addScaledVector(vec, -0.1);
			}
		}
		if (xon && zon && yon) {
			terrain[i].cube = cubeObj;
			return(true);
		}
	}
}

function updateTerrain() {
	for (var i = 0; i < terrain.length; i++) {
		terrain[i].updateSelf();
	}
}

function update() {
	scene.add(light.target);
	updateTerrain();
	handleInput();
	checkForPlayerCollision();
}

function toggleDebug() {
	debug = (!debug);
	if (debug) {
		// Show the Stats module
		stats.show();
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
	} else {
		// Hide stats
		stats.hide();
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
	debugChanged = true;
}

function animate() {
	requestAnimationFrame(animate);
	renderer.setSize(window.innerWidth, window.innerHeight);
	update();
	renderer.render(scene, camera);
	stats.fpsStats.update();
}

function start() {
	var startx = Math.floor(Math.random() * 10);
	var startz = Math.floor(Math.random() * 10);
	camera.position.x = startx;
	camera.position.z = startz;
	camera.position.y = 3;
	var playerCenterRayPoints = [];
	var randColor = Math.floor(Math.random() * 10)/10;
	var r = Math.floor(Math.random() * 100);
	var g = Math.floor(Math.random() * 100);
	var b = Math.floor(Math.random() * 100);
	var material = new THREE.LineBasicMaterial({
		color: 0xffffff,
		linewidth: 10
	});
	playerCenterRayPoints.push(new THREE.Vector3(camera.position.x, 20, camera.position.z));
	playerCenterRayPoints.push(new THREE.Vector3(camera.position.x, -20, camera.position.z));
	var geometry = new THREE.BufferGeometry();
	geometry.setFromPoints(playerCenterRayPoints);
	playerCenterRay = new THREE.Line(geometry, material);
	animate();
}
start();