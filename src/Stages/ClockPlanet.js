const SSSS_WIDTH = 1000;

class Stage60SSS extends Stage {
	constructor(args) {
		super(args);
	}
}

class Stage60SSS_Meteor extends Stage60SSS {
	constructor() {
		super({
			width : SSSS_WIDTH,
			height : SSSS_WIDTH,
			objects : [
				new ClockPlanet({
					spriteSheet : getSpriteSheet("Clock160brown"),
					spriteName : "body",
					x : SSSS_WIDTH/2,
					y : SSSS_WIDTH/2,
					radius : 80,
					gravRadius : Infinity,
				}),
				new BasePlayer({
					midX : SSSS_WIDTH/2,
					midY : 50,
				})
			],
		});
	}
}

class ClockPlanet extends Planet {
	constructor(args) {
		super(args);
	}
	update(stage) {
		this.time = stage.time;
		super.update(stage);
	}
	draw(...stuff) {
		super.draw(...stuff);
		var rotation = this.time * 2*Math.PI / (60*FPS)
		this.spriteSheet.drawOnWorld("hand", {x:this.x, y:this.y, xadj:.5, yadj:.5, rotation:rotation});
	}
}