var ZOOM_MIN = .5;
var ZOOM_MAX = 3;
var ZOOM_SPEED = .05;
var cameraLeftBound = 0;
var cameraRightBound = 1200;
var cameraTopBound = 0;
var cameraBottomBound = 900;
var oobtopcolor = "#000000";
var oobbottomcolor = "#000000";

class Camera {
	constructor(stage) {
		this.stage = stage;
		this.centerX = 0;
		this.centerY = 0;
		this.zoom = 1;
		worldCanvas.width = this.stage.width;
		worldCanvas.height = this.stage.height;
		this.rotation = 0;
	}
	update() {
		
	}
	move() {
		if (this.focus) {
			this.centerX = this.focus.getCameraX();
			this.centerY = this.focus.getCameraY();
			if (this.rotateWithFocus) {
				this.rotation = this.focus.getCameraRotation();
			}
		}
		if (this.controller.zoomIn)
			this.zoom = Math.min(this.zoom+ZOOM_SPEED, ZOOM_MAX);
		if (this.controller.zoomOut)
			this.zoom = Math.max(this.zoom-ZOOM_SPEED, ZOOM_MIN);
	}
	draw() {
		this.move();
		this.transfer();
	}
	transfer() {
		mainCtx.translate(mainCanvas.width/2, mainCanvas.height/2)
		mainCtx.rotate(-this.rotation);
		mainCtx.drawImage(worldCanvas, -this.centerX * this.zoom, -this.centerY * this.zoom, worldCanvas.width*this.zoom, worldCanvas.height*this.zoom);
		mainCtx.setTransform(1, 0, 0, 1, 0, 0);
	}
	rotateCW(amount) {
		this.rotation += amount;
	}
}
Camera.prototype.controller = globalController;

function drawOnStage(img, dx, dy, dWidth, dHeight) {
	if (!img || !(img.loaded)) {
		console.log("Image is undefined or not loaded",dx,dy);
		return false;
	}
	if (!dWidth) dWidth = img.width;
	if (!dHeight) dHeight = img.height;
	mainCtx.drawImage(img, (dx - camerax) * zoom + canvas.width/2, (dy - cameray) * zoom + canvas.height/2, dWidth * zoom, dHeight * zoom);
}
function drawSpriteOnStage(sprite, dx, dy, right = true, woff = 1/2, hoff = 1) {
	if (!sprite || (sprite instanceof HTMLImageElement && !(sprite.loaded))) {
		console.log(sprite);
		throw "Image is undefined or not loaded "+dx+", "+dy;
		return false;
	}
	var dWidth = sprite.width;
	var dHeight = sprite.height;
	
	if (right) {
		if (sprite instanceof HTMLImageElement)
			mainCtx.drawImage(sprite, stagex(dx - dWidth*woff), stagey(dy - dHeight*hoff), dWidth * zoom, dHeight * zoom);
		else
			mainCtx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height, stagex(dx - dWidth*woff), stagey(dy - dHeight*hoff), dWidth * zoom, dHeight * zoom);
	} else {
		mainCtx.translate(stagex(dx + dWidth*(1-woff)), stagey(dy - dHeight*hoff));
		mainCtx.scale(-1, 1);
		if (sprite instanceof HTMLImageElement)
			mainCtx.drawImage(sprite, 0, 0, dWidth*zoom, dHeight*zoom);
		else
			mainCtx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0, dWidth*zoom, dHeight*zoom);
		mainCtx.setTransform(1, 0, 0, 1, 0, 0);
	}
}

function fillTextOnStage(text, x, y, height = 18) {
	mainCtx.font  = (height * zoom) + "px " + getFont();
	mainCtx.fillText(text, stagex(x), stagey(y));
}

function flipHorizontally(img,x,y,width,height) { //https://stackoverflow.com/a/35973879
	if (!img || !(img.loaded)) {
		console.log("Image is undefined or not loaded",x,y);
		return false;
	}
	if (!width) width = img.width;
	if (!height) height = img.height;
    mainCtx.translate(x+width,y);
    mainCtx.scale(-1,1);
    mainCtx.drawImage(img,0,0,width,height);
    mainCtx.setTransform(1,0,0,1,0,0);
}

class MultiFocus {
	constructor(list) {
		this.list = list;
	}
	update() {
		this.x = this.list.reduce((acc, cur) => acc + cur.x, 0) / this.list.length;
		this.y = this.list.reduce((acc, cur) => acc + cur.y, 0) / this.list.length;
	}
}