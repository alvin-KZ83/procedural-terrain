function getDataFromPad(p5sketch, w, h, cell, cellSize) {
  for (let i = 0; i < h; i++) {
    colorGrid[i] = [];
    for (let j = 0; j < w; j++) {
      colorGrid[i + j * cell] = Math.floor(
        p5sketch.get(
          i * cellSize + cellSize / 2,
          j * cellSize + cellSize / 2
        )[0] / 75
      );
    }
  }
}

function parseData() {
  let N = Math.sqrt(colorGrid.length);
  for (let i = 0; i < N; i++) {
    dataGrid[i] = [];
    for (let j = 0; j < N; j++) {
      dataGrid[i][j] = colorGrid[i + j * N];
    }
  }
}

function dataparser(x, y, p5sketch) {
  let dataCell = 4;
  let dataCellSize;

  let sketch = function (q) {
    q.setup = function () {
      let datacnv = q.createCanvas(500, 500);
      datacnv.position(x, y);
      q.background(50);
    };
    q.draw = function () {
      dataCellSize = q.width / dataCell;
      let qwh = q.width / dataCellSize; //both width and height are the same
      getDataFromPad(p5sketch, qwh, qwh, dataCell, dataCellSize);
      parseData();
      for (let i = 0; i < qwh; i++) {
        for (let j = 0; j < qwh; j++) {
          q.fill(Math.max(30, colorGrid[i + j * dataCell] * 75));
          q.rect(
            i * dataCellSize,
            j * dataCellSize,
            dataCellSize,
            dataCellSize
          );
        }
      }
    };
    q.keyPressed = function () {
      switch (q.key) {
        case "=":
          if (dataCell < 50) dataCell += 1;
          break;
        case "-":
          if (dataCell > 4) dataCell -= 1;
          break;
        default:
          break;
      }
    };
  };
  return sketch;
}
