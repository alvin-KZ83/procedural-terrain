let data = [
  [0, 0, 0, 0, 2, 0],
  [0, 0, 1, 2, 3, 2],
  [0, 0, 1, 2, 3, 2],
  [0, 1, 2, 3, 3, 2],
  [1, 3, 3, 3, 3, 2],
  [0, 1, 1, 1, 1, 0],
];

  const upID = 0;
  const rightID = 1;
  const downID = 2;
  const leftID = 3;
  
function getTileData(data) {
    const tiles = new Object();
  
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        let tile = data[i][j];
  
        if (!tiles.hasOwnProperty(tile)) {
          tiles[tile] = new Object();
          tiles[tile]["weight"] = 0;
          tiles[tile]["patterns"] = [
            new Object(),
            new Object(),
            new Object(),
            new Object(),
          ];
        }
  
        tiles[tile]["weight"] += 1 / data.length ** 2;
  
        if (i > 0) {
          if (!tiles[tile]["patterns"][upID].hasOwnProperty(data[i - 1][j])) {
            tiles[tile]["patterns"][upID][data[i - 1][j]] = 0;
          }
          tiles[tile]["patterns"][upID][data[i - 1][j]] += 1;
        }
  
        if (j > 0) {
          if (!tiles[tile]["patterns"][leftID].hasOwnProperty(data[i][j - 1])) {
            tiles[tile]["patterns"][leftID][data[i][j - 1]] = 0;
          }
          tiles[tile]["patterns"][leftID][data[i][j - 1]] += 1;
        }
  
        if (i < data.length - 1) {
          if (!tiles[tile]["patterns"][downID].hasOwnProperty(data[i + 1][j])) {
            tiles[tile]["patterns"][downID][data[i + 1][j]] = 0;
          }
          tiles[tile]["patterns"][downID][data[i + 1][j]] += 1;
        }
  
        if (j < data.length - 1) {
          if (!tiles[tile]["patterns"][rightID].hasOwnProperty(data[i][j + 1])) {
            tiles[tile]["patterns"][rightID][data[i][j + 1]] = 0;
          }
          tiles[tile]["patterns"][rightID][data[i][j + 1]] += 1;
        }
      }
    }
  
    for (const key of Object.keys(tiles)) {
      for (const pos of Object.keys(tiles[key]["patterns"])) {
        if (!tiles[key]["patterns"][pos].hasOwnProperty(key)) {
          tiles[key]["patterns"][pos][key] = 1;
        }
        let sum = 0;
        for (const keyPos of Object.keys(tiles[key]["patterns"][pos])) {
          sum += tiles[key]["patterns"][pos][keyPos];
        }
        for (const keyPos of Object.keys(tiles[key]["patterns"][pos])) {
          tiles[key]["patterns"][pos][keyPos] =
            (tiles[key]["patterns"][pos][keyPos] / sum) * tiles[keyPos]["weight"];
        }
      }
    }
  
    return tiles;
  
}
  

function wavefcpad(x, y) {
  let sketch = function(s) {

  let tileDict = getTileData(data);

  class Cell {
    constructor() {
      this.collapsed = false;
      this.options = [0, 1, 2, 3];
    }
  
    setOptions(options) {
      this.options = options;
    }
  
    get entropy() {
      let entropy = 0;
      for (let j = 0; j < this.options.length; j++) {
        let ent = Math.log(tileDict[this.options[j]]["weight"]);
        entropy += (tileDict[this.options[j]]["weight"] * ent);
      }
      return -entropy;
    }
  
    remove(tile) {
      const index = this.options.indexOf(tile);
      if (index > -1) {
        this.options.splice(index, 1);
      }
    }
  
    getRandomPattern() {
      
      let optionDist = [tileDict[this.options[0]]["weight"]];
      if (this.options.length > 0) {
        for (let j = 1; j < this.options.length; j++) {
          optionDist[j] = optionDist[j - 1] + tileDict[this.options[j]]["weight"];
        }
      }
      
      let rand = Math.random() * optionDist[optionDist.length - 1];
  
      let index = -1;
  
      for (let i = 0; i < optionDist.length; i++) {
        if (optionDist[i] > rand) {
          index = i;
          break;
        }
      }
      this.options = [this.options[index]];
    }
  }
  
  class Grid {
    constructor(dim) {
      this.grid = [];
      this.DIM = dim;
      this.stable = false;
      for (let i = 0; i < this.DIM ** 2; i++) {
        this.grid[i] = new Cell();
      }
    }
  
    get finalGrid() {
      let output = "";
      for (let i = 0; i < this.DIM; i++) {
        for (let j = 0; j < this.DIM; j++) {
          output += this.grid[i + j * this.DIM].options[0];
        }
        output += "\n";
      }
      return output;
    }
  
    validifyOptions(allOptions, validOptions) {
      for (let i = allOptions.length - 1; i >= 0; i--) {
        if (!validOptions.includes(allOptions[i])) {
          allOptions.splice(i, 1);
        }
      }
    }
  
    noRuleCollapse() {
      for (let i = 0; i < this.DIM ** 2; i++) {
        this.grid[i].getRandomPattern();
      }
    }
  
    collapse() {
      this.stable = true;
      let gridcpy = this.grid.slice();
      gridcpy = gridcpy.filter((cell) => !cell.collapsed);
      gridcpy.sort((a, b) => {
        return a.entropy - b.entropy;
      });
  
      let lowestEntropy = gridcpy[0].entropy;
      let stopIndex = 0;
  
      for (let i = 1; i < gridcpy.length; i++) {
        if (gridcpy[i].entropy > lowestEntropy) {
          stopIndex = i;
          break;
        }
      }
  
      if (stopIndex > 0) gridcpy.splice(stopIndex);
  
      //Get a random cell to collapse
      const cellToCollapse = gridcpy[Math.floor(Math.random() * gridcpy.length)];
      cellToCollapse.collapsed = true;
      cellToCollapse.getRandomPattern();

      this.update();
    }

    update() {
      const nextGrid = [];
      for (let i = 0; i < this.DIM; i++) {
        for (let j = 0; j < this.DIM; j++) {
          let index = i + j * this.DIM;
  
          let upindex = i - 1 + j * this.DIM;
          let rightindex = i + (j + 1) * this.DIM;
          let downindex = i + 1 + j * this.DIM;
          let leftindex = i + (j - 1) * this.DIM;
  
          if (this.grid[index].collapsed) {
            nextGrid[index] = this.grid[index];
            continue;
          }
  
          this.stable = false;
  
          let allOptions = [0, 1, 2, 3];
          let validOptions = [];
  
          //look up and decide what can go in this cell
          if (i > 0) {
            for (let option of this.grid[upindex].options) {
              for (const key in Object.keys(
                tileDict[option]["patterns"][downID]
              )) {
                validOptions.push(parseInt(key));
              }
            }
            this.validifyOptions(allOptions, validOptions);
          }
          //do the same for right
          if (j < this.DIM - 1) {
            for (let option of this.grid[rightindex].options) {
              for (const key in Object.keys(
                tileDict[option]["patterns"][leftID]
              )) {
                validOptions.push(parseInt(key));
              }
            }
            this.validifyOptions(allOptions, validOptions);
          }
          //down
          if (i < this.DIM - 1) {
            for (let option of this.grid[downindex].options) {
              for (const key in Object.keys(tileDict[option]["patterns"][upID])) {
                validOptions.push(parseInt(key));
              }
            }
            this.validifyOptions(allOptions, validOptions);
          }
          //left
          if (j > 0) {
            for (let option of this.grid[leftindex].options) {
              for (const key in Object.keys(
                tileDict[option]["patterns"][rightID]
              )) {
                validOptions.push(parseInt(key));
              }
            }
            this.validifyOptions(allOptions, validOptions);
          }
  
          nextGrid[index] = new Cell();
          nextGrid[index].setOptions(allOptions);
        }
      }
  
      this.grid = nextGrid;
    }
  
    run() {
      while (!this.stable) {
        this.collapse();
      }
    }
  }

  let DIM;
  let waveGrid;
  let shouldRun;
  let typeCode;
  
  s.setup = function() {
    let cnv = s.createCanvas(500, 500);
    cnv.position(x, y);
    cnv.mousePressed(doStuff);
    DIM = 10;
    waveGrid = new Grid(DIM);
    shouldRun = true;
    typeCode = 0;
  }
  
  s.draw = function() {
    s.background(220);
  
    if (!waveGrid.stable && shouldRun) {
      waveGrid.collapse();
    }
  
    let w = s.width / DIM;
    let h = s.height / DIM;
  
    for (let i = 0; i < DIM; i++) {
      for (let j = 0; j < DIM; j++) {
        let cell = parseInt(waveGrid.grid[i + j * DIM].options[0]);
        s.fill(Math.max(30, cell * 75));
        s.rect(i * w, j * h, w, h);
      }
    }
    
    data = waveGrid.grid;
  }
  
  s.keyPressed = function() {
    switch (s.key) {
      case " ":
        if (shouldRun) {    
          tileDict = getTileData(dataGrid);
          shouldRun = false;
          waveGrid = new Grid(DIM);
        } else {
          shouldRun = true;
        }
        break;
      case '0':
      case '1':
      case '2':
      case '3':
        typeCode = parseInt(s.key);
        break;
    }
  }
  
  function doStuff() {
    let w = Math.floor(s.mouseY / (s.width / DIM));
    let h = Math.floor(s.mouseX / (s.height / DIM));
    let index = h + w * DIM;
    if (index < 0 || index >= DIM ** 2 || shouldRun == true) return;
    waveGrid.grid[index].collapsed = true;
    waveGrid.grid[index].options = [typeCode];
    waveGrid.update();
  }
  }
  
  return {sketch};
}