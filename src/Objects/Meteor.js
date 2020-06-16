class Meteor extends GameObject {
	constructor(args) {
		super();
		this.body = new UprightEllipseBody({
			midX : args.x,
			midY : args.y,
			width : 20,
			height : 20,
			doesGravity : 1,
		});
		this.facing = args.facing;
		this.speed = args.speed;
		this.spriteSheet = getSpriteSheet("Meteor");
	}
	update(stage) {
		this.body.physics(stage);
		if (this.body.doesGravity) {
			var vel = new VectorRect(this.body.dx, this.body.dy).setR(this.speed);
			this.body.doesGravity = false;
		}
		this.drawCount++;
		if (!this.spriteSheet.data["falling"+this.drawCount])
			this.drawCount = 0;
	}
	draw() {
		this.spriteSheet.drawOnWorld("falling"+this.drawCount, {x:this.body.midX, y:this.body.midY, xadj:.5, yadj:.5, rotation:this.body.rotation});
	}
}