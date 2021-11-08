// Three setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cannon setup
var world = new CANNON.World();
world.gravity.set(0, 0, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

var world, mass, body, shape, geometry, material, mesh;

var timeStep = 1/60;

shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
mass = 1;
body = new CANNON.Body({
	mass: 1
});
body.addShape(shape);
body.angularVelocity.set(0,10,0);
body.angularDamping = 0.5;
world.addBody(body);

/*
geometry = new THREE.BoxGeometry(1, 1, 1);
material = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true
});
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
*/

var mesh = new TCube(scene);
mesh.create();
mesh.add();

function updatePhysics() {
	// Step the physics world
	world.step(timeStep);
	// Copy coordinates from Cannon.js to Three.js
	mesh.cube.position.copy(body.position);
	mesh.cube.quaternion.copy(body.quaternion);
	mesh.wireframe.position.copy(body.position);
	mesh.wireframe.quaternion.copy(body.quaternion);
}

function render() {
	renderer.render(scene, camera);
}

function update() {
	requestAnimationFrame(update);

	updatePhysics();
	render();
}

function start() {
	camera.position.z = 5;
	update();
}

start();