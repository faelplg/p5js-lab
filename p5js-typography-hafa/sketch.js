// -- DEPENDENCIES
//
// --
// -- SHARED VARIABLES
let grid;
let numCols = 30;
let numRows = 30;
let font;
let text;
let txt = "amor";
// --
// -- PRELOAD DATA
function preload() {
	font = loadFont("Monofett-Regular.ttf");
}
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
	// - section: init text
	text = new Text(txt, font, 400, grid);
	text.init();
	// - log: text
	console.log(text);
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
	// grid.drawCells();
	// - section: draw points
	// grid.drawPoints();
	// - section: draw lines
	// grid.drawLines();
	// grid.drawMatrixLines();
	// - section: draw text
	// text.drawFactor(map((mouseX + mouseY) / 2, 0, width, 0.005, 0.1));
	// text.drawVertex();
	text.runEffect(frameCount);
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
		noFill();
		stroke("#005234"); // primary container (dark)
		this.points.forEach((point) => {
			rect(point.x, point.y, this.cw, this.ch);
		});
	}
	// - method: draw points array
	drawPoints() {
		this.points.forEach((point) => {
			point.draw();
		});
	}
	// - method: draw points array lines
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
	// - method: draw points matrix lines
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
class Text {
	constructor(text, font, fontSize, grid) {
		this.text = text;
		this.font = font;
		this.fontSize = fontSize;
		this.gw = grid.gw - grid.cw;
		this.gh = grid.gh - grid.ch;
		this.txcenter = this.gw / 2;
		this.tycenter = this.gh / 2;
		this.points = font.textToPoints(
			text,
			this.txcenter,
			this.tycenter,
			fontSize,
		);
		this.bounds = font.textBounds(text, this.txcenter, this.tycenter, fontSize);
	}
	init() {
		this.points.forEach((point) => {
			point.x = point.x - (this.bounds.x - this.txcenter + this.bounds.w / 2);
			point.y = point.y + this.bounds.h / 2;
		});
	}
	initFactor(factor) {
		this.points = this.font.textToPoints(
			this.text,
			this.txcenter,
			this.tycenter,
			this.fontSize,
			{
				sampleFactor: factor,
			},
		);
		this.init();
	}
	draw() {
		this.points.forEach((point) => {
			circle(point.x, point.y, 20);
		});
	}
	drawFactor(factor) {
		this.initFactor(factor);
		this.draw();
	}
	drawVertex() {
		noFill();
		stroke(255, 150);
		beginShape();
		this.points.forEach((point) => {
			vertex(point.x, point.y);
		});
		endShape();
	}
	runEffect(frameCount) {
		// noStroke();
		noFill();
		stroke(255, 255, 255, 150);
		let d = 0;
		let phase = 0;
		this.points.forEach((point) => {
			phase = dist(mouseX, mouseY, point.x, point.y);
			d = 300 * sin(frameCount + phase);
			circle(point.x, point.y, d);
		});
	}
}
// -- EOSKETCH
