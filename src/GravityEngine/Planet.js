class Planet {
	constructor(args) {
		this.x = args.x;
		this.y = args.y;
		this.radius = args.radius;
		this.gravRadius = args.gravRadius || args.radius*2;
		this.gravity = args.gravity || 0.5;
		this.priority = args.priority || 3;
		this.spriteSheet = args.spriteSheet;
		this.spriteName = args.spriteName;
		this.solidColor = args.solidColor;
	}
	isPixelSolid(x, y) {
		return (x-this.x)**2 + (y-this.y)**2 < this.radius**2;
	}
	getGravityAtPixel(x, y) {//TODO vector bullshit
		if ((x-this.x)**2 + (y-this.y)**2 < this.gravRadius**2)
			return new UnitVector(this.x-x, this.y-y).setR(this.gravity).setPriority(this.priority)
	}
	update(stage) {
		
	}
	draw() {
		if (this.spriteSheet) {
			this.spriteSheet.drawOnWorld(this.spriteName, {x:this.x, y:this.y, xadj:.5, yadj:.5});
		} else if (this.solidColor) {
			worldCtx.fillStyle = this.solidColor;
			worldCtx.beginPath();
			worldCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
			worldCtx.fill();
		}
	}
}