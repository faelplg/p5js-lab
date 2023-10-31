// -- SHARED VARIABLES
let grid;
let numCols = 12;
let numRows = 12;

let settings = {
	showGrid: true,
	gridType: "lines",
	showTrail: false,
	showAgents: true,
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
	frameRate(30);
	// noLoop();

	// - section: canvas styles
	background("#191C1A"); // background (dark)
	noFill();
	noStroke();
	strokeWeight(1);

	// - section: canvas grid
	grid = new Grid(numCols, numRows, windowWidth, windowHeight);
	if (settings.showGrid) grid.draw();
} // --

// -- DRAW CANVAS
function draw() {
	console.log("### drawing canvas...");
	// - section: draw styles
	settings.showTrail ? background(25, 28, 26, 5) : background("#191C1A"); // background (dark)

	// - section: control variables
	//

	// - section: draw grid
	if (settings.showGrid && frameCount > 1) grid.draw();

	// - section: render grid agents
	grid.render({ reset: "bounce", frameCount });
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
		this.matrix = this._createMatrix();
		// - section: define elements
		this.points = this._createPoints();
		// - section: define agents
		this.agents = this._createAgents();
		this.vLines = this._createLines(true);
		this.hLines = this._createLines(false);
	}

	// -# Internal methods
	_createMatrix() {
		return Array.from({ length: this.rows + 1 }, () => Array(this.cols + 1));
	}
	_createPoints() {
		const points = [];
		let point;
		for (let r = 0; r <= this.rows; r++) {
			for (let c = 0; c <= this.cols; c++) {
				point = new Point(c * this.cw, r * this.ch);
				points.push(point);
				this.matrix[r][c] = point;
			}
		}
		return points;
	}
	_createLines(isVertical) {
		return Array.from(
			{ length: isVertical ? this.cols + 1 : this.rows + 1 },
			(_, i) => {
				const a = createVector(
					isVertical ? i * this.cw : 0,
					isVertical ? 0 : i * this.ch,
				);
				const b = createVector(
					isVertical ? i * this.cw : this.width,
					isVertical ? this.height : i * this.ch,
				);
				return new LineAgent(a, b);
			},
		);
	}
	_createAgents() {
		return this.points.map((p) => new Agent(p));
	}

	// - method: init grid
	init() {
		// Additional initialization logic if needed
	}

	// - method: draw grid
	draw() {
		console.log("### drawing grid...");
		if (settings.showGrid && settings.gridType == "points") this.drawPoints();
	}
	// - method: draw grid points
	drawPoints() {
		console.log("### drawing points...");
		this.points.forEach((point) => {
			point.draw();
		});
	}

	// - method: render grid agents
	render(options) {
		console.log("### rendering agents...");
		console.log(options);

		if (settings.showGrid && settings.gridType == "lines")
			this.renderLineAgents({ ...options, dynamic: false });

		if (settings.showAgents) this.renderAgents(options);
	}
	// - method: render agents
	renderAgents(options) {
		this.agents.forEach((agent) => {
			agent.checkEdges(this.width, this.height, options.reset);
			agent.update();
			agent.draw();
		});
	}
	// - method: render grid line agents
	renderLineAgents(options) {
		console.log("### drawing grid lines...");
		this.vLines.forEach((line) => {
			if (options.dynamic) {
				line.checkEdges(this.width, this.height, options.reset);
				line.update();
			}
			line.draw();
		});
		this.hLines.forEach((line) => {
			if (options.dynamic) {
				line.checkEdges(this.width, this.height, options.reset);
				line.update();
			}
			line.draw();
		});
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
	constructor(point) {
		this.position = createVector(point.x, point.y);
		this.origin = this.position.copy();
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

	// - method: check canvas edges
	checkEdges(width, height, resetStrategy) {
		switch (resetStrategy) {
			case "bounce":
				this.bounce({ width, height });
				break;
			case "reset":
				if (
					this.position.x < 0 ||
					this.position.x > width ||
					this.position.y < 0 ||
					this.position.y > height
				)
					this.reset();
				break;
		}
	}

	// - method: reset agent at origin point
	reset() {
		this.position = this.origin.copy();
		this.velocity = createVector(random(-3, 3), random(-3, 3));
	}

	// - method: bounce agent
	bounce(cnv) {
		if (this.position.x > cnv.width || this.position.x < 0) {
			this.velocity.x *= -1;
		}
		if (this.position.y > cnv.height || this.position.y < 0) {
			this.velocity.y *= -1;
		}
	}
}
// --

// -- CLASS: LINE AGENT
class LineAgent extends Agent {
	constructor(start, end) {
		super(start, end);
		this.start = start;
		this.end = end;
	}

	// - method: update line agent
	update() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.start.add(this.velocity);
		this.end.add(this.velocity);
		this.acceleration.mult(0); // clear acceleration
	}

	// - method: draw line
	draw() {
		noFill();
		stroke("#404943"); // surface-variant (dark)
		strokeWeight(8);
		line(this.start.x, this.start.y, this.end.x, this.end.y);
	}
} // --
