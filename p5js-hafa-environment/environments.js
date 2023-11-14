// -- CLASS: LIQUID
class Liquid {
	// - method: class constructor
	constructor(x, y, w, h, c) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c; // coefficient of drag
	}

    // - method: check if agent is in contact with liquid
	contains(agent) {
		let pos = agent.position;

		return (
			pos.x > this.x &&
			pos.x < this.x + this.w &&
			pos.y > this.y &&
			pos.y < this.y + this.h
		);
	}

    // - method: calculate drag by agent
	calculateDrag(agent) {
        // Magnitude is coefficient * speed squared
		let speed = agent.velocity.mag();
		let dragMagnitude = this.c * speed * speed;
        // Direction is inverse of velocity
		let dragForce = agent.velocity.copy();
		dragForce.mult(-1);
        // Scale according to magnitude
		dragForce.setMag(dragMagnitude);
		return dragForce;
	}

	// - method: draw liquid area
	draw() {
		noStroke();
		fill(175);
		rect(this.x, this.y, this.w, this.h);
	}
}
