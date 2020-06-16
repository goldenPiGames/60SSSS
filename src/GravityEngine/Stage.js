const BLOCK = {name:"Block",solid:true,hazard:0};
const AIR = {name:"Air",solid:false,cursed:true,hazard:0}
const DEATH = {name:"Death",solid:false,cursed:true,hazard:Infinity}

class Stage {
	constructor(args) {
		this.width = args.width;
		this.height = args.height;
		this.objects = args.objects || [];
		this.gravX = typeof args.gravX == "number" ? args.gravX : args.gravity ? args.gravity.x : 0;
		this.gravY = typeof args.gravT == "number" ? args.gravT : args.gravity ? args.gravity.y : .5;
		this.time = 0;
	}
	getCtx() {
		
	}
	update() {
		this.objects.forEach(oj=>oj.update(this));
		this.time ++;
	}
	draw() {
		clearCanvas();
		this.objects.forEach(oj=>oj.draw(this));
	}
	isPixelSolid(x, y) {
		//TODO check only terrains
		return this.objects.find(oj=>oj.isPixelSolid && oj.isPixelSolid(x, y))
	}
	getGravityAtPixel(x, y) {//TODO vector bullshit
		var prior = -1;
		var curr;
		this.objects.forEach(oj => {
			if (oj.getGravityAtPixel) {
				var grav = oj.getGravityAtPixel(x, y);
				if (grav && grav.priority > prior) {
					prior = grav.priority;
					curr = grav;
				}
			}
		});
		return curr || new VectorRect(this.gravX, this.gravY);
	}
	addObject(oj) {
		this.objects.push(oj);
		//TODO add to specific lists
	}
}

function loadStage(stageName, doStuff=true) {
	if (isEnd(stageName))
		return false;
	runnee = loading;
	paused = false;
	currentStageName = stageName;
	currentStage = Stages[stageName];
	reEvalAnym();
	availAnym();
	if (currentStage.players > 1) {
		players[0] = new AnymosPlayer();
		players[0].controller = controllers[0];
		players[1] = new AnymosPlayer();
		players[1].controller = controllers[1];
		cameraFocus = new MultiFocus(players);
	} else {
		player = (currentStage.startFlying) ? new PlanePlayer() : new AnymosPlayer();
		cameraFocus = player;
	}
	used = 0;
	maxZoom = 6;
	minZoom = 1;
	gravity = .5;
	lastHitEnemy = null;
	oobtopcolor = "#00000000";
	oobbottomcolor = "#00000000";
	dynamicBackdrop = null;
	dynamicForeground = null;
	illuminateFore = false;
	switches = [];
	edgesSolid = true;
	resetLoading();
	loadReturn = ()=>beginStage(doStuff);
	stageImages = {
		mainBack : makeImage("src/Stages/"+(currentStage.reuseBack||currentStageName)+"/MainBack.png"),
		mainFore : makeImage("src/Stages/"+(currentStage.reuseFore||currentStageName)+"/MainFore.png"),
	}
	currentStage.load(doStuff); //loading specific stage
	Stages[stageName].toLoad.forEach(function(nem) {
		loadEnemy(nem);
	});
	return true;
}
function beginStage(doStuff) {
	normalCameraBounds();
	updateZoom();
	snapZoom();
	stageTimer = 0;
	if (currentStage.players > 1) {
		multiplayerCountdown.begin();
	} else {
		runnee = gameReady;
		if (Stages[currentStageName].startFlying)
			shooterEngine.begin();
		else
			gameReady.next = gameEngine;
	}
}