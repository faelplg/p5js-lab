let font;
let bounds;

function preload() {
  font = loadFont("Roboto-Regular.ttf");
}

function setup() {
  createCanvas(500, 500);
  textFont(font);
  textSize(32);
}

function draw() {
  background(220);

  let txt = 'p5.js';
  bounds = font.textBounds(txt, 0, 0, 32);
  
  fill(0);
  text(txt, 50, 100);
  
  noFill();
  stroke(255, 0, 0);
  rect(50 + bounds.x, 100 + bounds.y, bounds.w, bounds.h);
}
