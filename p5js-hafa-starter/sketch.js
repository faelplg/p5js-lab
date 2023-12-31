// -- SHARED VARIABLES
let grid;
let numCols = 1;
let numRows = 0;

// -- PROJECT SETTINGS
let settings = {
	showGrid: true,
	gridType: "lines",
	showTrail: true,
	renderAgents: false,
	renderParticles: true,
};
// --

// -- PRELOAD DATA
// function preload() {
// } // --

// -- SETUP CANVAS
function setup() {
	console.log("### setting up canvas...");
	// - section: canvas settings
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	// frameRate(30);
	// noLoop();

	// - section: canvas styles
	background("#191C1A"); // background (dark)
	noFill();
	noStroke();
	strokeWeight(1);

	// - section: canvas grid
	grid = new Grid(numCols, numRows, windowWidth, windowHeight);
	grid.init();
	if (settings.showGrid) grid.draw();
} // --

// -- DRAW CANVAS
function draw() {
	// - section: draw styles
	settings.showTrail ? background(25, 28, 26, 8) : background("#191C1A"); // background (dark)

	// - section: control variables
	//

	// - section: draw grid
	if (settings.showGrid && frameCount > 1) grid.draw();

	// - section: render grid agents
	grid.render({
		reset: "bounce",
		frameCount,
	});
	//
} // --
