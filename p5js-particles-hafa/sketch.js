// -- DEPENDENCIES
//
// --
// -- SHARED VARIABLES
let grid;
let numCols = 12;
let numRows = 12;
// --
// -- SETUP CANVAS
function setup() {
	// - log: SETUP CANVAS
	console.log("-- SETUP CANVAS");
	// - section: project settings
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	noLoop();
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
	// grid.drawMatrixLines();
	// - section: draw particles
	// grid.drawParticles("bounce");
	// - section: draw agents
	grid.drawAgents();
	// - section: particles effects
	// drawParticleLines(grid.particles);
	// drawParticleMouseLines(grid.particles, mouseX, mouseY);
	// reactMouseBounce(grid.particles, mouseX, mouseY);
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
		this.particles = Array(this.points.length); // grid particles
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
						this.particles[i] = new Particle({
							x: random(0, this.mw),
							y: random(0, this.mh),
						});
						break;
					default:
						this.particles[i] = new Particle(this.points[i]);
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
	// - method: draw grid particles
	drawParticles(OPTION) {
		this.particles.forEach((particle) => {
			// section: reset strategy
			switch (OPTION) {
				case "bounce": // bounce at edges
					if (particle.px < 0 || particle.px > this.mw) {
						particle.bounceX();
					}
					if (particle.py < 0 || particle.py > this.mh) {
						particle.bounceY();
					}
					break;
				case "reset": // reset
					if (
						particle.px < 0 ||
						particle.px > this.mw ||
						particle.py < 0 ||
						particle.py > this.mh
					) {
						particle.reset();
					}
					break;
				case "reset-invert": // reset + invert movement
					if (particle.px < 0 || particle.px > this.mw) {
						particle.reset();
						particle.bounceX();
					}
					if (particle.py < 0 || particle.py > this.mh) {
						particle.reset();
						particle.bounceY();
					}
					break;
				default: // destroy
					if (particle.px < 0 || particle.px > this.mw) {
						grid.destroyParticle(particle);
					}
					if (particle.py < 0 || particle.py > this.mh) {
						grid.destroyParticle(particle);
					}

					break;
			}
			particle.acelerate();
			particle.draw();
		});
	}
	// - method: draw grid agents
	drawAgents() {
		this.agents.forEach((agent) => {
			console.log(agent);
			agent.update();
			agent.draw();
		});
	}
	// - method: destroy particle
	destroyParticle(particle) {
		let index = this.particles.indexOf(particle);
		if (index !== this.particles.length - 1) {
			this.particles[index] = this.particles[this.particles.length - 1];
		}
		this.particles.pop();
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
// -- CLASS: PARTICLE
class Particle {
	// - method: class constructor
	constructor(point) {
		this.point = point;
		this.px = point.x;
		this.py = point.y;
		this.diameter = 32;
		this.vx = random(-2, 2);
		this.vy = random(-2, 2);
	}
	// - method: draw particle
	draw() {
		fill(255, 182, 139, 128); // tertiary (dark)
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
// -- FUNCTION: drawParticleLines
// i: draw lines between closer particles
const drawParticleLines = (particles) => {
	let dMin = 32;
	stroke(255, 182, 139, 128); // tertiary (dark)
	strokeWeight(64);
	// noStroke();
	for (let i = 0; i < particles.length; i = i + 1) {
		let pi = particles[i];
		for (let j = i + 1; j < particles.length; j = j + 1) {
			let pj = particles[j];
			let d = dist(pi.px, pi.py, pj.px, pj.py);
			if (d < dMin) {
				line(pi.px, pi.py, pj.px, pj.py);
			}
		}
	}
};
// -- FUNCTION: drawParticleMouseLines
// i: draw lines between mouse closer particles
const drawParticleMouseLines = (particles, mousex, mousey) => {
	let dMin = 256;
	stroke(255, 182, 139, 64); // tertiary (dark)
	strokeWeight(64);
	for (let i = 0; i < particles.length; i++) {
		let pi = particles[i];
		let d = dist(mousex, mousey, pi.px, pi.py);
		if (d < dMin) {
			line(mousex - grid.cw * 0.5, mousey - grid.ch * 0.5, pi.px, pi.py);
		}
	}
};
// -- FUNCTION: reactMouseBounce
// i: bounce particles with the mouse
const reactMouseBounce = (particles, mousex, mousey) => {
	for (let i = 0; i < particles.length; i++) {
		let p = particles[i];
		let d = dist(mousex, mousey, p.px, p.py);
		if (d <= p.diameter * 4) {
			let angulo = atan2(mousey - p.py, mousex - p.px);
			p.vx *= -1;
			p.vy *= -1;
			p.px -= cos(angulo) * 10;
			p.py -= sin(angulo) * 10;
		}
	}
};
// -- FUNCTION: keyPressed
// i: toggle fullscreen
const keyPressed = () => {
	console.log("keypressed...");
	let fs = fullscreen();
	fullscreen(!fs);
};
// -- EOSKETCH
