// Setup
var world = new CANNON.World({
  	gravity: new CANNON.Vec3(0, -9.82, 0)
});
world.solver.iterations = 10;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var terrain = [];
var keys = {
	a: false,
	d: false,
	w: false,
	s: false,
	ArrowLeft: false,
	ArrowRight: false
}

for (var x = 0; x < 10; x++) {
	for ( var z = 0; z < 10; z++) {
		var cube = new TCube(scene, world, new CANNON.Vec3(x, 0, z));
		cube.type = "grass";
		cube.create();
		cube.add();
		cube.cube.position.x = x;
		cube.cube.position.z = z;
		cube.wireframe.position.x = x;
		cube.wireframe.position.z = z;
		terrain.push(cube);
	}
}

function handleInputDown(key) {
	keys[key.key] = true;
}
function handleInputUp(key) {
	keys[key.key] = false;
}

function handleInput() {
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
	if (keys.ArrowLeft) {
		camera.rotation.y += 0.1;
	}
	if (keys.ArrowRight) {
		camera.rotation.y -= 0.1;
	}
}

function updatePhysics() {
	
}

function render() {
	renderer.render(scene, camera);
}

function update() {
	requestAnimationFrame(update);
	//camera.rotation.y += 0.01;
	handleInput();
	updatePhysics();
	render();
}

function start() {
	camera.position.z = 5;
	camera.position.y = 1;
	window.addEventListener("keydown", handleInputDown);
	window.addEventListener("keyup", handleInputUp);
	update();
}

start();