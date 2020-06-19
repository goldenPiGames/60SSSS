const STAGES_60SSSS = [
	Stage60SSSS_Race,
	Stage60SSSS_Meteor,
]

class SolarSystemEngine extends SingleStageEngine {
	constructor(index = 0) {
		super(new STAGES_60SSSS[index](), new HUD60());
		this.index = index;
	}
	update() {
		super.update();
		if (this.stage.time >= 60*FPS) {
			this.win();
		} if (this.stage.player.hp <= 0) {
			this.lose();
		}
	}
	draw() {
		super.draw();
	}
	win() {
		runnee = new SolarSystemEngine((this.index+1) % STAGES_60SSSS.length);
	}
	lose() {
		runnee = new SolarSystemEngine(this.index);
	}
}