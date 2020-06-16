const MIN_SOLID_SIZE = 5;
const MAX_REAL_STEP_2 = 0.25;

class PhysicsBody {
	
}

class UprightEllipseBody extends PhysicsBody {
	constructor(args) {
		super();
		this.midX = args.midX;
		this.midY = args.midY || args.footY - args.height/2,
		this.rHoriz = args.rHoriz || args.width/2,
		this.rVert = args.rVert || args.height/2,
		this.rotation = args.rotation || 0;
		this.slideGround = args.slideGround || 0;
		this.slideAir = args.slideAir || 1;
		this.dx = 0;
		this.dy = 0;
		this.doesGravity = args.doesGravity == undefined ? 1 : args.doesGravity;
	}
	physics(stage) {
		this.checkGrounded(stage);
		this.attemptMove(stage);
		//console.log(this.grounded)
		var grav = stage.getGravityAtPixel(this.getCenterX(), this.getCenterY())
		this.rotation = grav.theta-Math.PI;
		if (this.grounded) {
			this.attemptMove(stage, {dx:grav.x, dy:grav.y});
		}
		this.unOverlap(stage);
		if (this.doesGravity && !this.checkGrounded(stage)) {
			this.dx += grav.x * this.doesGravity;
			this.dy += grav.y * this.doesGravity;
		}
		
		if (Math.abs(this.dx) < 1e-4)
			this.dx = 0;
		if (Math.abs(this.dy) < 1e-4)
			this.dy = 0;
		//console.log("Before:", this.getRelativeDX())
		this.setRelativeDX(this.getRelativeDX() * (this.grounded ? this.slideGround : this.slideAir));
		//console.log("After:", this.getRelativeDX())
		//if you're grounded, try to stay grounded, even if moving on round planets
	}
	attemptMove(stage, args = {}) {
		var own = true;
		var dx = this.dx;
		if (typeof args.dx == "number") {
			dx = args.dx;
			own = false;
		}
		var dy = this.dy;
		if (typeof args.dy == "number") {
			dy = args.dy;
			own = false;
		}
		if (!dx && !dy)
			return false;
		let bx = this.midX;
		//console.log("Before:", this.midX, this.midY, dx, dy);
		//console.log(dx, dy)
		var loops = 0;
		var stepped = 0;
		var baseStepLength = 1 / Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (args.stepSize || MIN_SOLID_SIZE));
		//console.log(baseStepLength)
		var stepLength = baseStepLength;
		while (stepped < 1.0 && loops < 6969) {
			//console.log(stepLength);
			loops++;
			var hypothesis = new UprightEllipseBody(this);
			hypothesis.midX = this.midX + dx * stepLength;
			hypothesis.midY = this.midY + dy * stepLength;
			var norm = hypothesis.checkCollideNormal(stage);
			if (!norm) {
				stepped += stepLength;
				this.midX = hypothesis.midX;
				this.midY = hypothesis.midY;
			} else if (stepLength*(dx*dx+dy*dy) < MAX_REAL_STEP_2) {
				var newv = cancelVectorNormal(new VectorRect(dx, dy), norm);
				dx = newv.x;
				dy = newv.y;
				if (own) {
					this.dx = dx;
					this.dy = dy;
				}
				stepLength = Math.min(baseStepLength, 1-stepped);
			} else {
				stepLength /= 2;
			}
		}
		//console.log("After:", this.midX, this.midY, this.dx, this.dy);
		//console.log("Change:", this.midX-bx)
	}
	checkCollideNormal(stage) {
		for (var t = -Math.PI; t <= Math.PI; t += Math.PI/8) {
			if (this.isEdgeSolid(stage, t, 0))
				return new UnitVector(this.rotation+t-Math.PI);
		}
		return false;
	}
	unOverlap(stage) {
		var norm = this.checkCollideNormal(stage);
		if (norm) {
			this.midX += norm.x;
			this.midY += norm.y;
		}
	}
	getCenterX() {
		return this.midX;
	}
	getCenterY() {
		return this.midY;
	}
	//is pixel solid relative inner from bottom
	isEdgeSolid(stage, relAngle, out) {//TODO actually account for rotation
		return stage.isPixelSolid(this.getEdgeX(relAngle, out), this.getEdgeY(relAngle, out));
	}
	getEdgeX(relAngle, out = 0) {
		return this.midX + (this.rHoriz+out)*Math.sin(relAngle)*Math.cos(this.rotation) + (this.rVert+out)*Math.cos(relAngle)*Math.sin(this.rotation);
	}
	getEdgeY(relAngle, out = 0) {
		return this.midY + (this.rHoriz+out)*Math.sin(relAngle)*Math.sin(this.rotation) - (this.rVert+out)*Math.cos(relAngle)*Math.cos(this.rotation);
	}
	checkGrounded(stage) {
		this.grounded = this.isEdgeSolid(stage, Math.PI, 1);
		return this.rounded;
	}
	getRelativeDX() {
		return new VectorRect(this.dx, this.dy).rotate(-this.rotation).x;
		//return this.dx;
	}
	getRelativeDY() {
		return new VectorRect(this.dx, this.dy).rotate(-this.rotation).y;
	}
	setRelativeDX(nu) {
		var newv = new VectorRect(this.dx, this.dy).rotate(-this.rotation).setX(nu).rotate(this.rotation);
		this.dx = newv.x;
		this.dy = newv.y;
	}
	setRelativeDY(nu) {
		var newv = new VectorRect(this.dx, this.dy).rotate(-this.rotation).setY(nu).rotate(this.rotation);
		this.dx = newv.x;
		this.dy = newv.y;
	}
	/*getCenterY() {
		return this.footY - this.height/2;
	}
	getBottomY() {
		return this.footY;
	}*/
	selfMoveLateral(args) {
		//console.log(args)
		//console.log(this.grounded)
		var reldx = this.getRelativeDX();
		if (reldx + args.accel < -args.max || reldx + args.accel > args.max)
			return;
		//console.log(-args.max, reldx + args.accel, args.max, Math.max(-args.max, Math.min(reldx + args.accel, args.max)));
		this.setRelativeDX(Math.max(-args.max, Math.min(reldx + args.accel, args.max)))
		//console.log("Before:", reldx, " After:", this.getRelativeDX());
	}
	jump(speed) {
		this.setRelativeDY(-Math.abs(speed));
	}
	drawTest(args = {}) {
		worldCtx.fillStyle = args.color || "#FF0000";
		worldCtx.beginPath();
		worldCtx.ellipse(this.midX, this.midY, this.rHoriz, this.rVert, this.rotation, 0, 2*Math.PI);
		worldCtx.fill();
		worldCtx.fillStyle = args.radColor || "#0000FF";
		if (args.rads) {
			args.rads.forEach(rad => {
				worldCtx.beginPath();
				//console.log(this.midX, this.midY, rad, this.getEdgeX(rad), this.getEdgeY(rad));
				worldCtx.arc(this.getEdgeX(rad), this.getEdgeY(rad), 3, 0, 2*Math.PI);
				worldCtx.fill();
			});
		}
	}
}

var TEST_RADS = [Math.PI]