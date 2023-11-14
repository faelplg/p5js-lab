// -- DEPENDENCIES
//
// --

// -- SHARED VARIABLES
let grid;
let numCols = 36;
let numRows = 36;

let settings = {
	showGrid: true,
	gridType: "lines",
	showTrail: false,
	showAgents: true,
};
// --

// -- SETUP CANVAS
function setup() {
	console.log("### setting up canvas...");
	// - section: canvas settings
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	frameRate(30);
	colorMode(HSB);
	// noLoop();

	// - section: canvas styles
	background(30, 50, 50); // background (dark) transparency
	noFill();
	noStroke();
	strokeWeight(1);


	// - section: init grid
	grid = new Grid(numCols, numRows, windowWidth, windowHeight);
	grid.initGrid();
} // --

// -- DRAW CANVAS
function draw() {
	// console.log(grid);
	// - section: style canvas
	// background("#191C1A"); // background (dark)
	// background(25, 28, 26, 255); // background (dark) transparent

	// - section: control variables
	//

	// - section: draw
	// grid.drawGridLines();
	// grid.drawPoints();
	grid.drawAgents("reset", frameCount);
	//
} // --

// -- CLASS: GRID
class Grid {
	// - method: class constructor
	constructor(cols, rows, width, height) {
		// - section: inherit canvas size
		this.width = width;
		this.height = height;
		// - section: define grid structure
		this.cols = cols;
		this.rows = rows;
		// - section: define sizes
		this.numPoints = (this.rows + 1) * (this.cols + 1);
		this.cw = this.width / this.cols;
		this.ch = this.height / this.rows;
		// - section: define matrix
		this.matrix = Array(this.rows + 1);
		for (let r = 0; r < this.rows + 1; r++) {
			this.matrix[r] = Array(this.cols + 1);
		}
		// - section: define agents
		this.vLines = Array(this.cols + 1);
		this.hLines = Array(this.rows + 1);
		this.points = Array(this.numPoints); // grid points
		this.agents = Array(this.numPoints); // agents
	}
	// - method: init matrix grid
	initGrid(OPTION) {
		let x, y;
		let i = 0;
		for (let r = 0; r < this.hLines.length; r++) {
			y = r * this.ch;
			for (let c = 0; c < this.vLines.length; c++) {
				x = c * this.cw;
				this.matrix[r][c] = new Point(x, y);
				this.points[i] = this.matrix[r][c];
				switch (OPTION) {
					case "random":
						break;
					default:
						this.agents[i] = new FieldAgent(
							createVector(this.points[i].x, this.points[i].y),
						);
						break;
				}
				i++;
			}
		}

		// - section: create vertical lines
		for (let v = 0; v < this.vLines.length; v++) {
			this.vLines[v] = new LineAgent(
				createVector(v * this.cw, 0),
				createVector(v * this.cw, this.height),
			);
		}

		// - section: create horizontal lines
		for (let h = 0; h < this.hLines.length; h++) {
			this.hLines[h] = new LineAgent(
				createVector(0, h * this.ch),
				createVector(this.width, h * this.ch),
			);
		}
	}
	// - method: draw grid lines
	drawGridLines() {
		// - section: draw vertical lines
		for (let i = 0; i < this.vLines.length; i++) {
			this.vLines[i].draw();
		}

		// - section: draw horizontal lines
		for (let j = 0; j < this.hLines.length; j++) {
			this.hLines[j].draw();
		}
	}
	// - method: draw grid points
	drawPoints() {
		this.points.forEach((point) => {
			point.draw();
		});
	}
	// - method: draw agents
	drawAgents(OPTION, frameCount) {
		this.agents.forEach((agent) => {
			// section: reset strategy
			switch (OPTION) {
				case "bounce": // bounce at edges
					if (agent.position.x < 0 || agent.position.x > this.width) {
						agent.bounceX();
					}
					if (agent.position.y < 0 || agent.position.y > this.height) {
						agent.bounceY();
					}
					break;
				case "reset": // reset
					if (
						agent.position.x < 0 ||
						agent.position.x > this.width ||
						agent.position.y < 0 ||
						agent.position.y > this.height
					) {
						agent.reset();
					}
					break;
				case "reset-invert": // reset + invert movement
					if (agent.position.x < 0 || agent.position.x > this.width) {
						agent.reset();
						agent.bounceX();
					}
					if (agent.position.y < 0 || agent.position.y > this.height) {
						agent.reset();
						agent.bounceY();
					}
					break;
				default: // destroy
					// if (agent.position.x < 0 || agent.position.x > this.width) {
					// 	grid.destroyAgent(agent);
					// }
					// if (agent.position.y < 0 || agent.position.y > this.height) {
					// 	grid.destroyAgent(agent);
					// }

					break;
			}
			// agent.applyForce(createVector(0, -1));
			agent.update();
			agent.draw(frameCount);
		});
	}
} // --

// -- CLASS: LINE AGENT
class LineAgent {
	constructor(origin, target) {
		this.origin = origin;
		this.target = target;
	}

	// - method: init matrix grid
	draw() {
		noFill();
		stroke("#404943"); // surface-variant (dark)
		strokeWeight(8);

		line(this.origin.x, this.origin.y, this.target.x, this.target.y);
	}
} // --

// -- CLASS: POINT
class Point {
	// - method: class constructor
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	// - method: draw point
	draw() {
		noFill();
		stroke("#C0C9C1"); // on background (dark)
		strokeWeight(8);

		point(this.x, this.y);
	}
} // --

// -- CLASS: AGENT
class Agent {
	// - method: class constructor
	constructor(vector) {
		this.origin = vector;
		this.position = createVector(vector.x, vector.y);
		this.velocity = createVector(random(-3, 3), random(-3, 3));
		this.acceleration = createVector(0, 0);
		this.magnitude = 1;
		this.diameter = 16;
	}

	// - method: draw agent
	draw() {
		// fill("#72DAA5"); // primary (dark)
		fill(114, 218, 165, 150); // primary (dark) + transparency
		noStroke();

		ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
	}

	// - method: apply force and magnitude
	applyForce(force) {
		force.setMag(this.magnitude);
		this.acceleration.add(force);
	}

	// - method: update agent
	update() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0); // clear acceleration
	}

	// - method: reset agent at point origin
	reset() {
		this.position = createVector(this.origin.x, this.origin.y);
	}

	// - method: x bounce
	bounceX() {
		this.velocity.x *= -1;
	}
	// - method: y bounce
	bounceY() {
		this.velocity.y *= -1;
	}
}
// --

class FieldAgent extends Agent {
	// - method: class constructor
	constructor(vector) {
		super(vector);
		this.noiseScale = 0.002;
		this.noiseAngle = 360;
		this.flowSpeed = 10;
		this.ageMax = 50;
	}

	// - method: set agent flow
	setFlow() {
		let n =
			this.noiseAngle *
			noise(
				this.noiseScale * this.position.x,
				this.noiseScale * this.position.y,
			);

		this.velocity.x = this.flowSpeed * cos(n);
		this.velocity.y = this.flowSpeed * sin(n);
	}

	// - method: draw agent
	draw(frameCount) {
		noFill();
		stroke(114, 218, 165, map(frameCount, 1, this.ageMax, 255, 0)); // primary (dark) + transparency

		this.diameter = 2;
		this.setFlow();
		ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
	}
} // --

// -- FUNCTION: windowResized
// i: recalculate canvas size
function windowResized() {
	console.log("-- WINDOW RESIZED --");
	resizeCanvas(windowWidth, windowHeight);
	setup();
} // --

// -- FUNCTION: keyPressed
// i: toggle fullscreen
function keyPressed(e) {
	console.log("key pressed...", e);
	switch (e.key) {
		case "f":
			let fs = fullscreen();
			fullscreen(!fs);
			break;
		default:
			break;
	}
} // --
// -- EOSKETCH
