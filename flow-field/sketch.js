let nb = 500;
let noiseScale = 0.01;
let noiseAngle = 360;
let noiseSpeed = 10;
let ageMax = 200;
let p = Array(nb);

function setup() {
	createCanvas(500, 500);
	angleMode(DEGREES);
	background(0);
	for (let i = 0; i < nb; i = i + 1) {
		p[i] = new Particle(random(0, width), random(0, height));
	}
}

function draw() {
	// Particles
	// noStroke();
	// fill(255);
	stroke(255, map(frameCount, 1, ageMax, 255, 0));
	for (let i = 0; i < nb; i = i + 1) {
		p[i].draw();
	}
}

function keyPressed() {
	save("U4_L1_particles_connections.png");
}

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vx = random(-2, 2);
		this.vy = random(-2, 2);
	}

	draw() {
		let n = noiseAngle * noise(noiseScale * this.x, noiseScale * this.y);
		this.vx = noiseSpeed * cos(n);
		this.vy = noiseSpeed * sin(n);
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
		if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
			this.x = random(0, width);
			this.y = random(0, height);
		}
		// circle(this.x, this.y, 5);
		point(this.x, this.y);
	}
}
