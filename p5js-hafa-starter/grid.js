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
		// - section: define grid elements
		this.points = this._createPoints();
		this.vLines = this._createLines(true);
		this.hLines = this._createLines(false);
		// - section: define agents
		this.agents = this._createAgents();
		this.particles = this._createParticles();
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
				return new Line(a, b);
			},
		);
	}
	_createAgents() {
		return this.points.map((p) => new Agent(p));
	}
	_createParticles() {
		return this.points.map((p) => {
			if (!p.x) p.x = 0;
			if (!p.y) p.y = 0;
			return new ParticleAgent(p, {
				name: `p(${p.x},${p.y})`,
			});
		});
	}

	// - method: init grid
	init() {
		console.log("### initializing grid...");
		// Additional initialization logic if needed
	}

	// - method: draw grid
	draw() {
		if (settings.showGrid && settings.gridType == "points") this.drawPoints();
		if (settings.showGrid && settings.gridType == "lines") this.drawLines();
	}
	// - method: draw grid points
	drawPoints() {
		this.points.forEach((point) => {
			point.draw();
		});
	}
	// - method: draw grid lines
	drawLines() {
		this.vLines.forEach((line) => {
			line.draw();
		});
		this.hLines.forEach((line) => {
			line.draw();
		});
	}

	// - method: render grid agents
	render(options) {
		if (settings.renderAgents) this.renderAgents(options);
		if (settings.renderParticles) this.renderParticles(options);
	}
	// - method: render agents
	renderAgents(options) {
		this.agents.forEach((agent) => {
			agent.update();
			agent.draw();
			checkEdges(
				{ width: this.width, height: this.height },
				agent,
				options.reset,
			);
		});
	}
	// - method: render particles
	renderParticles(options) {
		this.particles.forEach((agent) => {
			agent.update();
			agent.draw();
			checkEdges(
				{ width: this.width, height: this.height },
				agent,
				options.reset,
			);
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

// -- CLASS: LINE
class Line {
	// - method: class constructor
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}

	// - method: draw line
	draw() {
		noFill();
		stroke("#404943"); // surface-variant (dark)
		strokeWeight(4);
		line(this.start.x, this.start.y, this.end.x, this.end.y);
	}
} // --
