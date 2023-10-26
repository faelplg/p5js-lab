let nb = 100;
let dMin = 100;
let p = Array(nb);

function setup() {
	createCanvas(500, 500);
	for (let i = 0; i < nb; i = i + 1) {
		p[i] = new Particle(random(0, width), random(0, height));
	}
}

function draw() {
	background(0);

	// Particles
	noStroke();
	fill(255);
	for (let i = 0; i < nb; i = i + 1) {
		p[i].draw();
	}

	// Connections
	stroke(255);
	for (let i = 0; i < nb; i = i + 1) {
		let pi = p[i];
		for (let j = i + 1; j < nb; j = j + 1) {
			let pj = p[j];
			let d = dist(pi.x, pi.y, pj.x, pj.y);
			if (d < dMin) {
				line(pi.x, pi.y, pj.x, pj.y);
			}
		}
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
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
		if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
			this.x = random(0, width);
			this.y = random(0, height);
		}
		circle(this.x, this.y, 5);
	}
}
