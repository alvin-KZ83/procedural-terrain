function sketchpad(x, y) {
  let penColor;
  let penThickness;
  const colorStep = 75;
  const bg = 50;
  
  let sketch = function(p) {
    p.setup = function() {
      let cnv = p.createCanvas(500, 500);
      cnv.position(x, y);
      p.background(bg);
      penColor = (1 * colorStep);
      penThickness = 30;
    }
    p.draw = function() {
      p.cursor(p.CROSS);
      if (p.mouseIsPressed === true) {
        if (p.mouseButton == p.LEFT) {
          p.stroke(penColor);
          p.strokeWeight(penThickness);
          p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        }
      }
    }
    p.keyPressed = function() {
      switch(p.key) {
        case 'e':
          penColor = (bg); 
          break;
        case '1':
        case '2':
        case '3':
          penColor = (parseInt(p.key) * colorStep); 
          break;
        case '[':
          if (penThickness > 10) penThickness -= 10;
          break;
        case ']':
          if (penThickness < 100) penThickness += 10;
          break;
        default:
      }
    }
  }
  return sketch;
}