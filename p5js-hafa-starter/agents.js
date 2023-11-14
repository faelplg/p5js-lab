// -- CLASS: AGENT
class Agent {
	// - method: class constructor
	constructor(point) {
		this.position = createVector(point.x, point.y);
		this.origin = this.position.copy();
		this.velocity = createVector(0, 0);
		this.acceleration = createVector(0, 0);
	}

	// - method: apply force and magnitude
	applyForce(force) {
		this.acceleration.add(force);
	}

	// - method: update agent
	update() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0); // clear acceleration
	}

	// - method: draw agent
	draw() {
		noFill();
		stroke(114, 218, 165);
		strokeWeight(10);
		point(this.position.x, this.position.y);
	}
}

// -- CLASS: PARTICLE AGENT
class ParticleAgent extends Agent {
	// - method: class constructor
	// settings: {name, size, mass, force}
	constructor(point, settings) {
		super(point);
		this.name = settings && settings.name ? settings.name : "particle";
		this.size =
			settings && settings.size ? settings.size : floor(random(16, 256));
		this.mass = settings && settings.mass ? settings.mass : this.size * 20;
		this.force =
			settings && settings.force ? settings.force : createVector(0, 0);
	}

	// - method: update agent
	update() {
		// this.applyRandomVelocity();
		this.applyGravity();
		this.applyWind();
		this.applyFriction();
		super.update();
	}

	// - method: apply a specific force
	applyGravity() {
		let f = p5.Vector.mult(createVector(0, 0.1), this.mass);
		super.applyForce(p5.Vector.div(f, this.mass));
	}

	// - method: apply a specific force
	applyRandomVelocity() {
		super.applyForce(createVector(random(-1, 1), random(-1, 1)));
	}

	// - method: apply a specific force
	applyEnvironmentForce(force) {
		let f;
		f = p5.Vector.mult(force, this.mass);
		console.log(force, this.mass);
		super.applyForce(p5.Vector.div(force, this.mass));
		// super.applyForce(force);
	}

	applyWind() {
		if (key == "ArrowRight") {
			super.applyForce(createVector(0.1, 0));
		} else if (key == "ArrowLeft") {
			super.applyForce(createVector(-0.1, 0));
		} else if (key == "ArrowDown") {
			super.applyForce(createVector(0, 0));
		}
	}

	applyFriction() {
		let c = 0.01;
		let normal = 1;
		let frictionMag = c * normal;
		let friction = this.velocity.copy();
		friction.mult(-1);
		friction.normalize();
		friction.mult(frictionMag);
		if (this.contactEdge()) {
			super.applyForce(friction);
		}
	}

	// - method: draw agent
	draw() {
		// fill("#72DAA5"); // primary (dark)
		fill(114, 218, 165, 128); // primary (dark) + transparency
		noStroke();
		ellipse(this.position.x, this.position.y, this.size);
	}

	contactEdge() {
		return this.position.y > height - this.size / 2 - 1;
	}
}
// --
