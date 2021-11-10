class FPSStats {
	constructor() {
		this.beginTime = Date.now();
		this.now = Date.now();
		this.fps = 0;
		this.frameCount = 0;
		this.fpsAverage = 0;
		this.dom = document.getElementById("stats_fps");
		this.text = "";
	}
	read() {
		this.fps = this.frameCount;
		this.frameCount = 0;
		this.text = "FPS: " + this.fps;
		return(this.text);
	}
	update() {
		this.now = Date.now();
		var timePassed = this.now - this.beginTime;
		this.frameCount += 1;
		this.beginTime = Date.now();
		if (this.fps < 50) {
			this.dom.style.backgroundColor = "rgb(200, 20, 20)";
		} else if (this.fps >= 50) {
			this.dom.style.backgroundColor = "rgb(20, 200, 20)";
		} else {
			this.dom.style.backgroundColor = "rgb(0, 0, 0)";
		}
	}
	show() {
		this.dom.style.display = "block";
	}
	hide() {
		this.dom.style.display = "none";
	}
}
class GameStats {
	constructor() {
		this.fpsStats = new FPSStats();
		//this.fpsStats._update();
	}
	update() {
		this.fpsStats.dom.innerHTML = this.fpsStats.read();
	}
	read() {
		return(this.fpsStats.read());
	}
	show() {
		this.fpsStats.show();
	}
	hide() {
		this.fpsStats.hide();
	}
}