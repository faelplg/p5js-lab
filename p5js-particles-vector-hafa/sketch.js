// -- DEPENDENCIES
//
// --
// -- SHARED VARIABLES
let grid;
let numCols = 24;
let numRows = 24;
// --
// -- SETUP CANVAS
function setup() {
	// - log: SETUP CANVAS
	console.log("-- SETUP CANVAS");
	// - section: project settings
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	// noLoop();
	// - section: project styles
	// background("#191C1A"); // background (dark)
	// - section: init grid
	grid = new Grid(numCols, numRows, windowWidth, windowHeight);
	grid.initGrid();
	// - log: grid
	console.log(grid);
	// - log: end SETUP CANVAS
	console.log("--");
} // --
// -- DRAW CANVAS
function draw() {
	// - log: DRAW CANVAS
	// console.log("-- DRAW CANVAS");
	// - section: style canvas
	background("#191C1A"); // background (dark)
	// - section: control variables
	//
	// - section: translate
	grid.translate();
	// - section: draw cells
	grid.drawCells();
	// - section: draw points
	// grid.drawPoints();
	// - section: draw lines
	grid.drawBoundaries();
	// grid.drawLines();
	grid.drawMatrixLines();
	// - section: draw agents
	grid.drawAgents("bounce");
	// - log: end DRAW CANVAS
	// console.log("--");
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
		this.cells = this.cols * this.rows;
		// - section: define sizes
		this.gw = width * 0.9; // fullscreen grid
		this.gh = height * 0.9; // fullscreen grid
		this.cw = this.gw / this.cols;
		this.ch = this.gh / this.rows;
		this.mw = this.gw - this.cw; // matrix width
		this.mh = this.gh - this.ch; // matrix height
		// - section: define margin x and y
		this.marginX = (width - this.gw) * 0.5;
		this.marginY = (height - this.gh) * 0.5;
		// - section: define matrix
		this.matrix = Array(this.rows);
		for (let r = 0; r < this.rows; r++) {
			this.matrix[r] = Array(this.cols);
		}
		// - section: define agents
		this.points = Array(this.cells); // matrix points
		this.agents = Array(this.points.length); // grid agents
	}
	// - method: init matrix grid
	initGrid(OPTION) {
		let x;
		let y;
		let i = 0;
		for (let r = 0; r < this.rows; r++) {
			y = (r % this.rows) * this.ch;
			for (let c = 0; c < this.cols; c++) {
				x = (c % this.cols) * this.cw;
				this.matrix[r][c] = new Point(x, y, this.cw, this.ch);
				this.points[i] = this.matrix[r][c];
				switch (OPTION) {
					case "random":
						break;
					default:
						this.agents[i] = new Agent(this.points[i]);
						break;
				}
				i++;
			}
		}
	}
	// - method: translate grid
	translate() {
		translate(this.marginX, this.marginY);
		translate(this.cw * 0.5, this.ch * 0.5);
	}
	// - method: draw grid cells
	drawCells() {
		noFill();
		stroke("#005234"); // primary container (dark)
		strokeWeight(1);
		this.points.forEach((point) => {
			rect(point.x, point.y, this.cw, this.ch);
		});
	}
	// - method: draw matrix points
	drawPoints() {
		this.points.forEach((point) => {
			point.draw();
		});
	}
	// - method: draw grid agents
	drawAgents(OPTION) {
		this.agents.forEach((agent) => {
			// section: reset strategy
			switch (OPTION) {
				case "bounce": // bounce at edges
					if (agent.pos.x < 0 || agent.pos.x > this.mw) {
						agent.bounceX();
					}
					if (agent.pos.y < 0 || agent.pos.y > this.mh) {
						agent.bounceY();
					}
					break;
				case "reset": // reset
					if (
						agent.pos.x < 0 ||
						agent.pos.x > this.mw ||
						agent.pos.y < 0 ||
						agent.pos.y > this.mh
					) {
						agent.reset();
					}
					break;
				case "reset-invert": // reset + invert movement
					if (agent.pos.x < 0 || agent.pos.x > this.mw) {
						agent.reset();
						agent.bounceX();
					}
					if (agent.pos.y < 0 || agent.pos.y > this.mh) {
						agent.reset();
						agent.bounceY();
					}
					break;
				default: // destroy
					// if (agent.pos.x < 0 || agent.pos.x > this.mw) {
					// 	grid.destroyAgent(agent);
					// }
					// if (agent.pos.y < 0 || agent.pos.y > this.mh) {
					// 	grid.destroyAgent(agent);
					// }

					break;
			}
			agent.applyForce(createVector(0, 0.2));
			agent.update();
			agent.draw();
		});
	}
	// - method: draw points lines
	drawLines() {
		stroke("#8FF7C0"); // on primary container (dark)
		strokeWeight(1);
		for (let i = 0; i < this.points.length - 1; i++) {
			line(
				this.points[i + 0].x,
				this.points[i + 0].y,
				this.points[i + 1].x,
				this.points[i + 1].y,
			);
		}
	}
	// - method: draw matrix boundaries
	drawBoundaries() {
		stroke("#93000A");
		strokeWeight(1);
		line(
			0,
			0,
			this.matrix[0][this.cols - 1].x,
			this.matrix[0][this.cols - 1].y,
		);
		line(
			this.matrix[0][this.cols - 1].x,
			this.matrix[0][this.cols - 1].y,
			this.matrix[this.rows - 1][this.cols - 1].x,
			this.matrix[this.rows - 1][this.cols - 1].y,
		);
		line(
			this.matrix[this.rows - 1][this.cols - 1].x,
			this.matrix[this.rows - 1][this.cols - 1].y,
			this.matrix[this.rows - 1][0].x,
			this.matrix[this.rows - 1][0].y,
		);
		line(
			this.matrix[this.rows - 1][0].x,
			this.matrix[this.rows - 1][0].y,
			0,
			0,
		);
	}
	// - method: draw matrix lines
	drawMatrixLines(OPTION) {
		stroke("#D0E8D7"); // on secondary container (dark)
		strokeWeight(1);
		switch (OPTION) {
			case "horizontal":
				for (let r = 0; r < this.rows; r++) {
					for (let c = 0; c < this.cols - 1; c++) {
						line(
							this.matrix[r][c + 0].x,
							this.matrix[r][c + 0].y,
							this.matrix[r][c + 1].x,
							this.matrix[r][c + 1].y,
						);
					}
				}
				break;
			case "vertical":
				for (let c = 0; c < this.cols; c++) {
					for (let r = 0; r < this.rows - 1; r++) {
						line(
							this.matrix[r + 0][c].x,
							this.matrix[r + 0][c].y,
							this.matrix[r + 1][c].x,
							this.matrix[r + 1][c].y,
						);
					}
				}
				break;
			default:
				for (let r = 0; r < this.rows - 1; r++) {
					for (let c = 0; c < this.cols - 1; c++) {
						line(
							this.matrix[r][c + 0].x,
							this.matrix[r][c + 0].y,
							this.matrix[r][c + 1].x,
							this.matrix[r][c + 1].y,
						);
						line(
							this.matrix[r + 0][c].x,
							this.matrix[r + 0][c].y,
							this.matrix[r + 1][c].x,
							this.matrix[r + 1][c].y,
						);
						if (c == this.cols - 2) {
							line(
								this.matrix[r + 0][this.cols - 1].x,
								this.matrix[r + 0][this.cols - 1].y,
								this.matrix[r + 1][this.cols - 1].x,
								this.matrix[r + 1][this.cols - 1].y,
							);
						}
						if (r == this.rows - 2) {
							line(
								this.matrix[this.rows - 1][c + 0].x,
								this.matrix[this.rows - 1][c + 0].y,
								this.matrix[this.rows - 1][c + 1].x,
								this.matrix[this.rows - 1][c + 1].y,
							);
						}
					}
				}
		}
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
		stroke("#8FF7C0"); // on primary container (dark)
		strokeWeight(6);
		point(this.x, this.y);
	}
} // --
// -- CLASS: AGENT
class Agent {
	// - method: class constructor
	constructor(point) {
		this.point = point;
		this.pos = createVector(point.x, point.y);
		this.vel = createVector(random(-1, 1), random(-1, 1));
		this.accel = createVector(0, 0);
		this.diam = 16;
	}
	// - method: apply vector to acceleration
	applyForce(power) {
		this.accel.add(power);
	}
	// - method: draw agent
	update() {
		this.vel.add(this.accel);
		this.pos.add(this.vel);
		this.accel.mult(0); // clear acceleration
	}
	// - method: draw agent
	draw() {
		fill(255, 182, 139, 128); // tertiary (dark)
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.diam, this.diam);
	}
	// - method: x bounce
	bounceX() {
		this.vel.x *= -1;
	}
	// - method: y bounce
	bounceY() {
		this.vel.y *= -1;
	}
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
