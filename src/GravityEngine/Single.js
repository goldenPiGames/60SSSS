class SingleStageEngine {
	constructor(stage, hud) {
		this.stage = stage;
		this.camera = new Camera(this.stage);
		this.camera.focus = this.stage.cameraFocus || this.stage.objects.find(oj=>oj.focusme) || this.stage.objects.find(oj=>oj.controller);
	}
	update() {
		this.stage.update();
	}
	draw() {
		clearCanvas();
		clearWorld();
		this.stage.objects.forEach(oj=>oj.draw(this, worldCtx))
		this.camera.draw();
	}
}