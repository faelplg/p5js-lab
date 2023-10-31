// -- MISC: debouncedWindowResized
// i: run window resized logic
let debouncedWindowResized = debounce(function () {
	console.log("-- WINDOW RESIZED --");
	resizeCanvas(windowWidth, windowHeight);
	// grid.saveAgentsState();
	grid = new Grid(numCols, numRows, windowWidth, windowHeight);
    grid.draw();
	// grid.restoreAgentsState();
}, 250); // Aguarda 250 milissegundos antes de executar novamente

// -- FUNCTION: debounce
// i: using debounce to deal with window resizing
function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

// -- FUNCTION: windowResized
// i: manage window resizing
function windowResized() {
    console.log("###!!! window resized");
	debouncedWindowResized();
}