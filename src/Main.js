var backgroundBox;
var mainCanvas;
var mainCtx;
var fcanvas;
var fctx;
var worldCanvas;
var worldCtx;
//var stage;
const MISC_SPRITE_NAMES = ["MainMenuLogo", "Selector", "Paused", "SelectStage", "SelectStageNo", "SelectStage100", "SelectEnd", "SelectEndNo", "SelectCorners", "Gamepad"]
var miscSprites;
var miscSprites = {};
var miscSFX = {};
var emergencyStuff;
//var usingPizz = settings.sfxSystem;

//var stageBackground;

function begin() {
	backgroundBox = document.getElementById("BackgroundBox");
	
	mainCanvas = document.getElementById("MainCanvas");
	mainCtx = mainCanvas.getContext("2d");
//	mainCtx.imageSmoothingEnabled = false;
//	mainCtx.mozImageSmoothingEnabled = false;
//	mainCtx.webkitImageSmoothingEnabled = false;
	
	/*fcanvas = document.getElementById("ForeCanvas");
	fctx = fcanvas.getContext("2d");
	fctx.imageSmoothingEnabled = false;
//	fctx.mozImageSmoothingEnabled = false;
	fctx.webkitImageSmoothingEnabled = false;*/
	
	worldCanvas = document.getElementById("WorldCanvas");
	worldCtx = worldCanvas.getContext("2d");
	
	emergencyStuff = document.getElementById("Emergency");
	//initMusic();
	//loadGame();
	//loadReturn = begin2;
	//resetLoading();
	/*MISC_SPRITE_NAMES.forEach(function(nom) {
		miscSprites[nom] = makeImage("src/MiscSprites/"+nom+".png");
	});*/
	//TODO make spritesheet for misc sprites
	//miscSprites = makeSprites("src/MiscSprites.png")
	//loadDefaultSFX();
	//applySettings();
	
	begin2();
}
function begin2() {
	//runnee = new SingleStageEngine(new DemoStageGrid());
	//runnee = new SingleStageEngine(new DemoStagePlanet());
	runnee = new SingleStageEngine(new Stage60SSS_Meteor());
	engine.run();
	//loadStage("TutorialMovement");
}

var loadingTotal = 0;
var loadedYet = 0;
var loadReturn = function(){};
function resetLoading() {
	loadingTotal = 0;
	loadedYet = 0;
}
function makeImage(src) {
	var img = new Image();
	loadingTotal++;
	img.loaded = false;
	img.onload = function() {
		loadedYet++;
		//img.crossOrigin = "anonymous";
		img.loaded = true;
		if (loadedYet >= loadingTotal) {
			resetLoading();
			loadReturn();
		}
	};
	img.src = src;
	return img;
}

function makeSprites(sauce, sec, prel = true) {
	var image;
	if (typeof sauce == "string") {
		if (prel)
			image = makeImage(sauce);
	} else {
		image = sauce;
		sauce = image.src;
	}
	var sheetData = {image:image, src:sauce};
	if (Array.isArray(sec)) {
		var subs = Array.prototype.slice.call(arguments, 1);
		subs.forEach(function(oj) {
			oj.image = sauce;
			sheetData[oj.name] = oj;
			oj.parent = sheetData;
		});
	} else {
		for (var sub in sec) {
			sheetData[sub] = sec[sub];
			sheetData[sub].image = image;
			sheetData[sub].parent = sheetData;
		}
	}
	return sheetData;
}

function loadSprites(data) {
	//console.log(data);
	if (data) {
		var image = makeImage(data.src);
		//console.log(image);
		data.image = image;
		for (var sub in data) {
			data[sub].image = image;
		}
	}
}

function doNothing() {};

function PRound(num, seed) {
	var whole = Math.floor(num);
	var partial = num-whole;
	if (seed == undefined)
		return whole + ((Math.random() < partial) ? 1 : 0);
	return whole + ((seed < partial) ? 1 : 0);
}

function flipCoin() {
	return (Math.random() >= .5);
}

function greater(t, f) {
	if (t > f)
		return true;
	if (t < f)
		return false;
	return Math.random() <= 1/2;
}

function mid() {
	var args = Array.prototype.slice.call(arguments);
	args.sort(function(a, b){return a - b});
	return args[Math.floor(args.length/2)];
};

function Pmax() {
	var args = Array.prototype.slice.call(arguments);
	for (var i = 0; i < args.length; i++) {
		if (!args[i])
			args[i] = 0;
	}
	return Math.max.apply(this, args);
}