console.log(
  "TERRAIN GENERATION USING WAVE FUNCTION COLLAPSE AND PERLIN NOISE\n" +
  "Version 1.0 'No Optimization'  ||  April 6, 2023  ||  Alvin KZ\n" +
  "\n" +
  "Available Features: \n\n" +
  "1. Sketchpad (Top Left)\n" +
  "2. Grid Analysis (Bottom Left)\n" +
  "3. WaveForm Demonstration (Top Right)\n" +
  "\n" +
  "Command List:\n\n" +
  "1, 2, 3:    Changes between the three available colors (1, 2, 3)\n" +
  "e, E:       Enables the eraser in the sketchpad\n" +
  "[ and ]:    Controls the thickness of the pen for sketchpad\n" +
  "- and =:    Controls the number of cells in the grid analysis\n" +
  "r:          Changes the render type from basic fill to texture based\n" +
  "\n" +
  "More to come...\n"
);

// browser-sync start --server -f -w TO RUN LOCAL SERVER

let colorGrid = []; //array to store the input data in a 1D array
let dataGrid = []; //array to store the integer representation of the sketch from colorGrid in a 2D array

let paintpad = new p5(sketchpad(0, 0)); //Creates the sketch board for users
let datapad = new p5(dataparser(0, 500, paintpad)); //Displays the taken sketch converted to a grid
// let waveform = new p5(wavepad(500, 0)); //Displays wave changes using fractal browmian motion and noise
let wavefc = new p5(wavefcpad(0, 1000, dataGrid).sketch); //Displays the wave function collpase algorithm

//TERRAIN GENERATION
let angle;
let L;
let mapSize;
let N = 4; //size of each cell
let cellSize = 25;
let sliderTerrain = [];
let img;
//let waterImg;
let song;
let amp;
let maxVolume = 0.2;
let button;
let peak;
let level;
let xTerra;
let yTerra;

let renderType = true;

function preload() {
  img = loadImage('img/simple.png');
  //waterImg = loadImage('water.gif');
  song = loadSound("audio/Razor Sharp.mp3", loaded);
}

function loaded() {
  button = createButton("Play");
  button.position(1655 + 175, 350);
  button.size(150, 50);
  button.mousePressed(togglePlaying);
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(maxVolume);
    button.html('pause');
  } else {
    song.pause();
    button.html('play');
  }
}

function setup() {
  let cnv = createCanvas(1500, 1500, WEBGL);
  cnv.position(500, 0);
  angle = -20 * (PI / 180);
  for (let i = 0; i < 5; i++) {
    sliderTerrain[i] = createSlider(0, 1, 0.5, 0.0001);
    sliderTerrain[i].position(500 + 10, (i + 1) * 30);
    sliderTerrain[i].style("width", "200px");
    sliderTerrain[i].addClass("mySliders");
  }
  amp = new p5.Amplitude();
}

function draw() {
  //ambientLight(100, 100, 100);
  L = createHeightMap(N);
  mapSize = L.length * cellSize;

  background(50);

  translate(350, -350, 500);
  texture(img)
  plane(200, 200);

  translate(-350, 350, -500);

  rotateX(angle);
  rotateY((frameCount % 360) * (PI / 180));

  //directionalLight(255, 255, 255, 0, 1, -1);

  //center map
  translate(-mapSize / 2, 0, -mapSize / 2);
  getTerrain(L, cellSize);

  //orbitControl();
  //water surface
  rotateX(90 * (PI / 180));
  translate(mapSize / 2, mapSize / 2, 0);

  if (renderType) {
    peak = 1 + 4 * sliderTerrain[0].value();
    level = 4 + 6 * sliderTerrain[1].value();
    xTerra = sliderTerrain[2].value();
    yTerra = sliderTerrain[3].value();
  } else {
    let bumpy = map(amp.getLevel(), 0, maxVolume, 0, 0.5);
    peak = 3 + bumpy;
    level = 7 + bumpy;
    xTerra = 0.5;
    yTerra = 0.5;
  }
  fill(0, 18, 33, 100 * sliderTerrain[4].value());
  translate(0, 0, -30);
  box(mapSize, mapSize, 100);

  //SLIDERS
  //peak = 1 + 3 * sliderTerrain[0].value();
  // level = 5 + 10 * sliderTerrain[1].value();
  // xTerra = sliderTerrain[2].value();
  // yTerra = sliderTerrain[3].value();
  // waterShade = sliderTerrain[4].value();
}

function keyPressed() {
  switch (key) {
    case 'r':
      renderType = !renderType;
      break;
    default:
      break;
  }
}

function createHeightMap(N) {
  let L = [];
  for (let row = 0; row < N * 10; row++) {
    L[row] = [];
    let r = Math.floor(row / N) * 50 - 25;
    for (let col = 0; col < N * 10; col++) {
      let c = Math.floor(col / N) * 50 - 25;
      let type = Math.floor(wavefc.get(r, c)[0] / 75);
      let value = (0.5 + type) ** peak * level * noise(xTerra * row, yTerra * col);
      L[row][col] = value;
    }
  }
  return L;
}

function getTerrain(L, cell) {
  for (let row = 0; row < L.length - 1; row++) {
    texture(img);
    textureMode(NORMAL);
    stroke(img.get(0,0));
    strokeWeight(1);
    beginShape(TRIANGLE_STRIP);
    for (let col = 0; col < L.length; col++) {
      let hTop = Math.max(0, L[row][col]);
      let hDown = Math.max(0, L[row + 1][col]);

      let hmax = (3.5) ** peak * level;

      let uTop = map(hTop, 0, hmax, 0.1, 1.0);
      let uDown = map(hDown, 0, hmax, 0.1, 1.0);
      vertex(col * cell, -hTop, row * cell, uTop, 0);
      vertex(col * cell, -hDown, (row + 1) * cell, uDown, 0);
    }
    endShape();
  }
}
