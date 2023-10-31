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
// -- EOSKETCH
