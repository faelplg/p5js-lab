let font;
let points;
let bounds;
let txt = "ha.fa";
let xTxt = 0;
let yTxt = 250;
let fontSize = 300;
let sizeMax = 80;
let speed = 3;
function preload() {
	font = loadFont("Roboto-Regular.ttf");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	xTxt = width / 2;
	yTxt = height / 2;
}

function draw() {
	computePoints(map(mouseX, 0, width, 0.005, 0.1));
	// computePoints(0.1);
	background(0);

	noFill();
	stroke(255, 150);
	beginShape();
	for (let i = 0; i < points.length; i++) {
		vertex(points[i].x, points[i].y);
	}
	endShape();

	fill(0);
	// noFill();
	strokeWeight(2);
	let d = 0;
	let phase = 0;
	for (let i = 0; i < points.length; i++) {
		phase = dist(mouseX, mouseY, points[i].x, points[i].y);
		d = sizeMax * sin(frameCount + phase);
		circle(points[i].x, points[i].y, d);
	}
}

function keyPressed() {
	save("typography_project.png");
}

function computePoints(factor) {
	points = font.textToPoints(txt, xTxt, yTxt, fontSize, {
		sampleFactor: factor,
	});
	bounds = font.textBounds(txt, xTxt, yTxt, fontSize);
	for (let i = 0; i < points.length; i++) {
		let p = points[i];
		p.x = p.x - (bounds.x - xTxt + bounds.w / 2);
		p.y = p.y + bounds.h / 2;
		// p.x = p.x - bounds.w/2;
		// p.y = p.y + bounds.h/2;
	}
}
