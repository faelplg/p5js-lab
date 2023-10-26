// -- DEPENDENCIES
//
// --
// -- SHARED VARIABLES
let grid;
let numCols = 30;
let numRows = 30;
// --
// -- SETUP CANVAS
function setup() {
	// - log: SETUP CANVAS
	console.log("-- SETUP CANVAS");
	// - section: project settings
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	rectMode(CENTER);
	// noLoop();
	// - section: project styles
	// background("#191C1A"); // background (dark)
	// - section: init grid
	grid = new Grid(numCols, numRows, width, height);
	grid.initGrid();
	// - log: grid
	console.log(grid);
	// - log: end SETUP CANVAS
	console.log("--");
} // --
// -- DRAW CANVAS
function draw() {
	// - log: DRAW CANVAS
	console.log("-- DRAW CANVAS");
	// - section: style canvas
	background("#191C1A"); // background (dark)
	// - section: control variables
	//
	// - section: translate
	grid.translate();
	// - section: draw cells
	grid.drawCells();
	// - section: draw agents
	grid.drawPoints();
	grid.drawParticles();
	// - section: draw lines
	grid.drawLines();
	grid.drawMatrixLines();
	grid.drawBoundaries();
	// - log: end DRAW CANVAS
	console.log("--");
} // --
// -- CLASS: GRID
class Grid {
	// - method: class constructor
	constructor(cols, rows, width, height) {
		// - section: inherit canvas size
		this.width = width;
		this.height = height;
		// - section: define grid
		this.cols = cols;
		this.rows = rows;
		this.cells = cols * rows;
		// - section: define sizes
		this.gw = width * 0.8;
		this.gh = height * 0.8;
		this.cw = this.gw / this.cols;
		this.ch = this.gh / this.rows;
		this.mw = this.gw - this.cw;	// matrix width
		this.mh = this.gh - this.ch;	// matrix height
		// - section: define margin x and y
		this.marginX = (width - this.gw) * 0.5;
		this.marginY = (height - this.gh) * 0.5;
		// - section: define matrix
		this.matrix = Array(this.rows);
		for (let r = 0; r < this.rows; r++) {
			this.matrix[r] = Array(this.cols);
		}
		// - section: define agents
		this.points = Array(this.cells);			// matrix points
		this.particles = Array(this.points.length);	// grid particles
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
						this.particles[i] = new Particle({
							x: random(0, this.mw),
							y: random(0, this.mh),
						});
						break;
					default:
						this.particles[i] = new Particle(this.points[i]);
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
	// - method: draw grid particles
	drawParticles(OPTION) {
		this.particles.forEach((particle) => {
			// section: reset strategy
			switch (OPTION) {
				case "bounce":
					if (particle.px < 0 || particle.px > this.mw) {
						particle.bounceX();
					}
					if (particle.py < 0 || particle.py > this.mh) {
						particle.bounceY();
					}
					break;
				default:
					if (particle.px < 0 || particle.px > this.mw) {
						particle.reset();
						particle.bounceX();
					}
					if (particle.py < 0 || particle.py > this.mh) {
						particle.reset();
						particle.bounceY();
					}
					break;
			}
			particle.acelerate();
			particle.draw();
		});
	}
	// - method: draw points array lines
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
	// - method: draw matrix boundary
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
	// - method: draw points matrix lines
	drawMatrixLines(CASE) {
		stroke("#D0E8D7"); // on secondary container (dark)
		strokeWeight(1);
		switch (CASE) {
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
// -- CLASS: PARTICLE
class Particle {
	// - method: class constructor
	constructor(point) {
		this.point = point;
		this.px = point.x;
		this.py = point.y;
		this.diameter = 8;
		this.vx = random(-2, 2);
		this.vy = random(-2, 2);
	}
	// - method: draw particle
	draw() {
		fill(255, 182, 139); // tertiary (dark)
		// noFill();
		noStroke();
		circle(this.px, this.py, this.diameter);
	}
	// - method: acelerate particle
	acelerate() {
		this.px += this.vx;
		this.py += this.vy;
	}
	// - method: reset particle at point origin
	reset() {
		this.px = this.point.x;
		this.py = this.point.y;
	}
	// - method: x bounce
	bounceX() {
		this.vx *= -1;
	}
	// - method: y bounce
	bounceY() {
		this.vy *= -1;
	}
} // --
// -- EOSKETCH
