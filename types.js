class CameraControler {
	constructor(cameraObj) {
		this.camera = cameraObj;
	}
	rotateY(amount) {
		if ((this.camera.rotation.y + amount) >= 6) {
			this.camera.rotation.y = 0;
		} else {
			if ((this.camera.rotation.y + amount) < 0) {
				var remain = Math.abs(this.camera.rotation.y + amount);
				this.camera.rotation.y = 6 - remain;
			} else {
				this.camera.rotation.y += amount;
			}
		}
	}
	rotateX(amount) {
		this.camera.rotation.x += amount;
	}
	rotateZ(amount) {
		this.camera.rotation.z += amount;
	}
	setY(pos, add = 0) {
		if (add == 0) {
			this.camera.position.y = pos;
		} else {
			this.camera.position.y += pos;
		}
	}
	setX(pos, add = 0) {
		if (add == 0) {
			if (pos > 0 && pos < WORLD_WIDTH) {
				this.camera.position.x = pos;
			}
		} else {
			if (this.camera.position.x + pos > 0 && this.camera.position.x + pos < WORLD_WIDTH) {
				this.camera.position.x += pos;
			}
		}
	}
	setZ(pos, add = 0) {
		if (add == 0) {
			if (pos > 0 && pos < WORLD_LENGTH) {
				this.camera.position.z = pos;
			}
		} else {
			if (this.camera.position.z + pos > 0 && this.camera.position.z + pos < WORLD_LENGTH) {
				this.camera.position.z += pos;
			}
		}
	}
	getRotationY() {
		return(this.camera.rotation.y);
	}
	getRotationX() {
		return(this.camera.rotation.x);
	}
	getRotationZ() {
		return(this.camera.rotation.z);
	}
}

class TCube {
	constructor(scene, type = "unknown") {
		this.scene = scene;
		this.cube;
		this.wireframe;
		this.type = type;
	}
	create() {
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var wireframe = new THREE.WireframeGeometry(geometry);
		var material = new THREE.MeshBasicMaterial({
			color: 0x00ff00
		});
		this.cube = new THREE.Mesh(geometry, material);
		this.wireframe = new THREE.LineSegments(wireframe);
	}
	add() {
		this.scene.add(this.cube);
		this.scene.add(this.wireframe);
	}
	updateSelf() {
		switch (this.type) {
			case "dirt":
				this.cube.material[0].color.setHex(0x964B00);
				break;
			case "grass":
				this.cube.material[0].color.setHex(0x964B00);
				this.cube.material[1].color.setHex(0x964B00);
				this.cube.material[2].color.setHex(0x00ff00);
				this.cube.material[3].color.setHex(0x964B00);
				this.cube.material[4].color.setHex(0x964B00);
				this.cube.material[5].color.setHex(0x964B00);
				break;
			case "air":
			default:
				this.cube.material[0].color.setHex(0x888888);
				break;
		}
	}
	setY(pos, add = 0) {
		if (add == 0) {
			this.cube.position.y = pos;
			this.wireframe.position.y = pos;
		} else {
			this.cube.position.y += pos;
			this.wireframe.position.y += pos;
		}
	}
	setX(pos, add = 0) {
		if (add == 0) {
			this.cube.position.x = pos;
			this.wireframe.position.x = pos;
		} else {
			this.cube.position.x += pos;
			this.wireframe.position.x += pos;
		}
	}
	setZ(pos, add = 0) {
		if (add == 0) {
			this.cube.position.z = pos;
			this.wireframe.position.z = pos;
		} else {
			this.cube.position.z += pos;
			this.wireframe.position.z += pos;
		}
	}
}

class Compass {
	constructor(cameraControler, textBox) {
		this.directions = {
			"_0": "North",
			"_1_5": "West",
			"_3": "South",
			"_4_5": "East"
		};
		this.cameraControler = cameraControler;
		this.textBox = textBox;
	}
	update() {
		var rot = this.cameraControler.getRotationY();
		if (rot < 1.5 && rot >= 0) {
			this.textBox.innerHTML = "North";
		} else if (rot >= 1.5 && rot < 3) {
			this.textBox.innerHTML = "West";
		} else if (rot >= 3 && rot < 4.5) {
			this.textBox.innerHTML = "South";
		} else if (rot >= 4.5 && rot < 6) {
			this.textBox.innerHTML = "East";
		} else {
			this.textBox.innerHTML = "Undefined";
		}
	}
}
/*
class Collider {
	constructor(entity) {
		this.xzcollider = Rect();
	}
}

class Rect{
	constructor(x, y, w, h){

	}
}
*/