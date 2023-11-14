let paused = false;
let isFullscreen = false;

// -- FUNCTION: keyPressed
// i: toggle fullscreen
function keyPressed(e) {
	console.log("key pressed...", e);

	if (e.key === "p" || e.key === "P") {
		if (paused) {
			loop();
		} else {
			noLoop();
		}
		paused = !paused;
	}

	if (e.key === "f" || e.key === "F") {
		isFullscreen ? fullscreen(false) : fullscreen(true);
		isFullscreen = !isFullscreen;
	}
} // --

// -- FUNCTION: checkEdges
// i: check canvas edges
function checkEdges(cnv, agent, reset) {
	switch (reset) {
		case "bounce":
			agentBounceInelastic(cnv, agent);
			break;
		case "reset":
			agentReset(cnv, agent);
			break;
	}
} // --

// -- FUNCTION: agentReset
// i: reset agent at origin point
function agentReset(cnv, agent) {
	if (
		agent.position.x < 0 ||
		agent.position.x > cnv.width ||
		agent.position.y < 0 ||
		agent.position.y > cnv.height
	)
		agent.position = agent.origin.copy();
} // --

// -- FUNCTION: agentBounce
// i: agent bounce at edges
function agentBounce(cnv, agent) {
	if (agent.size) {
		if (agent.position.x > cnv.width - agent.size / 2) {
			agent.position.x = cnv.width - agent.size / 2;
			agent.velocity.x *= -1;
		}
		if (agent.position.x < 0 + agent.size / 2) {
			agent.position.x = 0 + agent.size / 2;
			agent.velocity.x *= -1;
		}

		if (agent.position.y > cnv.height - agent.size / 2) {
			agent.position.y = cnv.height - agent.size / 2;
			agent.velocity.y *= -1;
		}
		if (agent.position.y < 0 + agent.size / 2) {
			agent.position.y = 0 + agent.size / 2;
			agent.velocity.y *= -1;
		}
	} else {
		if (agent.position.x > cnv.width) {
			agent.position.x = cnv.width;
			agent.velocity.x *= -1;
		}
		if (agent.position.x < 0) {
			agent.position.x = 0;
			agent.velocity.x *= -1;
		}

		if (agent.position.y > cnv.height) {
			agent.position.y = cnv.height;
			agent.velocity.y *= -1;
		}
		if (agent.position.y < 0) {
			agent.position.y = 0;
			agent.velocity.y *= -1;
		}
	}
} // --

// -- FUNCTION: agentBounceInelastic
// i: agent bounce at edges and slow down acceleration
function agentBounceInelastic(cnv, agent) {
	// A new variable to simulate an inelastic collision
	// 10% of the velocity's x or y component is lost
	let bounce = -0.9;
	if (agent.size) {
		if (agent.position.x > cnv.width - agent.size / 2) {
			agent.position.x = cnv.width - agent.size / 2;
			agent.velocity.x *= bounce;
		}
		if (agent.position.x < 0 + agent.size / 2) {
			agent.position.x = 0 + agent.size / 2;
			agent.velocity.x *= bounce;
		}

		if (agent.position.y > cnv.height - agent.size / 2) {
			agent.position.y = cnv.height - agent.size / 2;
			agent.velocity.y *= bounce;
		}
		if (agent.position.y < 0 + agent.size / 2) {
			agent.position.y = 0 + agent.size / 2;
			agent.velocity.y *= bounce;
		}
	} else {
		if (agent.position.x > cnv.width) {
			agent.position.x = cnv.width;
			agent.velocity.x *= bounce;
		}
		if (agent.position.x < 0) {
			agent.position.x = 0;
			agent.velocity.x *= bounce;
		}

		if (agent.position.y > cnv.height) {
			agent.position.y = cnv.height;
			agent.velocity.y *= bounce;
		}
		if (agent.position.y < 0) {
			agent.position.y = 0;
			agent.velocity.y *= bounce;
		}
	}
} // --
// -- EOSKETCH
