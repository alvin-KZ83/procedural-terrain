let sliders = [];
function wavepad(x, y) {
  let sketch = function (r) {
    r.setup = function () {
      let cnv = r.createCanvas(500, 500);
      cnv.position(x, y);

      for (let i = 0; i < 7; i++) {
        sliders[i] = r.createSlider(0, 1, 0.5, 0.0001);
        sliders[i].position(x + 10, y + (i + 1) * 30);
        sliders[i].style("width", "200px");
        sliders[i].addClass("mySliders");
      }
    };
    r.draw = function () {
      r.background(25);
      r.fill(58, 90, 64);
      r.textSize(20);
      r.textStyle(r.BOLD);
      let A = 5 * sliders[0].value(); //ranges from 0 - 5
      r.text("Amplitude: " + A, 225, 45);
      let k = sliders[1].value(); //ranges from 0 - 1
      r.text("Frequency: " + k, 225, 75);

      r.fill(5 * 16 + 8, 8 * 16 + 1, 5 * 16 + 7);
      let a = sliders[2].value(); //ranges from 0 - 1
      r.text("Amplitude Fall-Off: " + a, 225, 105);
      let b = 1 + sliders[3].value(); //ranges from 1 - 2
      r.text("Frequency Fall-Off: " + b, 225, 135);

      r.fill(10 * 16 + 3, 11 * 16 + 1, 8 * 16 + 10);
      let o = 6 * sliders[4].value(); //ranges from 0 - 6
      r.text("Octave Count: " + Math.floor(o), 225, 165);

      r.fill(13 * 16 + 10, 13 * 16 + 7, 12 * 16 + 13);
      let xjump = 1 + 5 * sliders[5].value(); //ranges from 0 - 6
      r.text("Display Range: " + Math.floor(xjump), 225, 195);
      
      let elevation = 1 + 100 * sliders[6].value(); //ranges from 1 - 100
      r.text("Elevation Range: " + elevation, 225, 225);

      r.beginShape();
      r.vertex(0, r.height);
      for (let i = 0; i < r.width / xjump; i++) {
        r.vertex(xjump * i, 400 + 5 * anoise(A, k, a, b, o, elevation, i));
      }
      r.vertex(r.width, r.height);
      r.endShape();
    };
  };
  return sketch;
}

function anoise(A, k, a, b, o, e, x) {
  let y = A * Math.sin(k * x);
  for (let i = 0; i < o; i++) {
    y += (x/e) + a ** i * A * Math.sin(b ** i * k * x);
  }
  return y;
}