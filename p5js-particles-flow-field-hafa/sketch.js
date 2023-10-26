// -- DEPENDENCIES
//
// --
// -- SHARED VARIABLES
let grid;
let numCols = 30;
let numRows = 30;
let particles = [];
// --
// -- SETUP CANVAS
function setup() {
	// - section: project settings
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	rectMode(CENTER);
	// noLoop();
	// - section: project styles
	background("#191C1A"); // background (dark)
	// - section: init grid
	grid = new Grid(numCols, numRows, width, height);
	grid.initGrid();
	// - log: grid
	console.log(grid);
	// - section: init particles
	grid.points.forEach((point) => {
		particles.push(new Particle(point, grid, 2.5));
	});
} // --
// -- DRAW CANVAS
function draw() {
	// - section: translate
	grid.translate();
	// - section: draw particles
	particles.forEach((particle) => {
		// particle.draw(frameCount * 0.5);
		particle.drawFlowField(frameCount * 4);
	});
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
		this.gw = width;
		this.gh = height;
		this.cw = this.gw / this.cols;
		this.ch = this.gh / this.rows;
		// - section: define margin x and y
		this.mx = (width - this.gw) * 0.5;
		this.my = (height - this.gh) * 0.5;
		// - section: define points
		this.points = Array(this.cells);
		// - section: define matrix
		this.matrix = Array(this.rows);
	}
	// - method: init matrix grid
	initGrid() {
		let x;
		let y;
		let i = 0;
		for (let r = 0; r < this.rows; r++) {
			this.matrix[r] = Array(this.cols);
			y = (r % this.rows) * this.ch;
			for (let c = 0; c < this.cols; c++) {
				x = (c % this.cols) * this.cw;
				this.matrix[r][c] = new Point(x, y, this.cw, this.ch);
				this.points[i] = this.matrix[r][c];
				i++;
			}
		}
	}
	// - method: translate grid
	translate() {
		translate(this.mx, this.my);
		translate(this.cw * 0.5, this.ch * 0.5);
	}
	// - method: draw grid cells
	drawCells() {
		fill("#191C1A"); // background (dark)
		stroke("#005234"); // primary container (dark)
		this.points.forEach((point) => {
			rect(point.x, point.y, this.cw, this.ch);
		});
	}
	// - method: draw grid points
	drawPoints() {
		this.points.forEach((point) => {
			point.draw();
		});
	}
	// - method: draw points lines
	drawLines() {
		stroke("#8FF7C0"); // on primary container (dark)
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
		stroke("#93000A"); // error container (dark)
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
	drawMatrixLines(CASE) {
		stroke("#D0E8D7"); // on secondary container (dark)
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
		point(this.x, this.y);
	}
} // --
// -- CLASS: PARTICLE
// !!! Os manipuladores da partócula devem estar fora dela.
class Particle {
	// - method: class constructor
	constructor(point, grid, diameter) {
		this.point = point;
		this.grid = grid;
		this.diameter = diameter;
		this.px = point.x;
		this.py = point.y;
		this.gw = grid.gw - grid.cw;
		this.gh = grid.gh - grid.ch;
		this.vx = random(-1.5, 1.5);
		this.vy = random(-1.5, 1.5);
		this.pRandX = random(0, this.gw);
		this.pRandY = random(0, this.gh);
		this.noiseScale = 0.01;
		this.noiseAngle = 180;
		this.noiseSpeed = 2;
		this.flowAge = 240;
	}
	// - method: draw particles
	draw(frameCount) {
		fill(255, 182, 139, map(frameCount, 1, this.flowAge, 255, 0)); // Tertiary (dark)
		noStroke();
		this.px = this.px + this.vx;
		this.py = this.py + this.vy;
		// section: bounce
		if (this.px < 0 || this.px > this.gw) {
			this.vx *= -1;
		}
		if (this.py < 0 || this.py > this.gh) {
			this.vy *= -1;
		}
		circle(this.px, this.py, this.diameter);
	}
	// - method: draw flow field
	drawFlowField(frameCount) {
		fill(114, 218, 165, map(frameCount, 1, this.flowAge, 255, 0)); // Tertiary (dark)
		noStroke();
		let n =
			this.noiseAngle *
			noise(this.noiseScale * this.pRandX, this.noiseScale * this.pRandY);
		this.vx = this.noiseSpeed * cos(n);
		this.vy = this.noiseSpeed * sin(n);
		this.pRandX = this.pRandX + this.vx;
		this.pRandY = this.pRandY + this.vy;
		// section: random
		if (this.pRandX < 0 || this.pRandX > this.gw) {
			this.pRandX = random(0, this.gw);
		}
		if (this.pRandY < 0 || this.pRandY > this.gh) {
			this.pRandY = random(0, this.gh);
		}
		circle(this.pRandX, this.pRandY, this.diameter);
	}
}

// -- EOSKETCH
