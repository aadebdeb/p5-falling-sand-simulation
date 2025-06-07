class Sand {
  constructor(seed) {
    this._seed = seed; // for coloring
  }

  get seed() {
    return this._seed;
  }
}

class FallingSandSimulation {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this._cells = new Array(height);
    for (let yi = 0; yi < height; yi++) {
      this._cells[yi] = new Array(width).fill(null); // null represents empty cells
    }
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  getAt(x, y) {
    return this._cells[y][x]
  }

  setAt(x, y, sand) {
    this._cells[y][x] = sand;
  }

  update() {
    for (let y = 0; y < this._height; y++) {
      let isLeftToRight = Math.random() < 0.5;
      for (let x = 0; x < this._width; x++) {
        this._updateCell(isLeftToRight ? x : this._width - 1 - x, y);
      }
    }
    // Noita version
    // let isLeftToRight = frameCount % 2 === 0;
    // for (let y = 0; y < this._height; y++) {
    //   for (let x = 0; x < this._width; x++) {
    //     this._updateCell(isLeftToRight ? x : this._width - 1 - x, y);
    //   }
    //   isLeftToRight = !isLeftToRight;
    // }
  }

  _updateCell(x, y) {
    if (y === 0) return; // if sand has already reached on the ground, do nothing
    if (!this._cells[y][x]) return; // if the cell is empty, do nothing

    const bottomCell = this._cells[y - 1][x];
    if (!bottomCell) { // if the cell below is empty, sand can fall straight down
      this._swap(x, y, x, y - 1);
      return;
    }

    const isBottomLeftEmpty = x > 0 && !this._cells[y - 1][x - 1];
    const isBottomRightEmpty = x < this._width - 1 && !this._cells[y - 1][x + 1];
    if (isBottomLeftEmpty && isBottomRightEmpty) { // if both bottom left and bottom right are empty, sand can fall diagonally to left or right
      if (Math.random() < 0.5) {
        this._swap(x, y, x - 1, y - 1);
      } else {
        this._swap(x, y, x + 1, y - 1);
      }
    } else if (isBottomLeftEmpty) { // if only bottom left is empty, sand can fall diagonally to the left
      this._swap(x, y, x - 1, y - 1);
    }
    else if (isBottomRightEmpty) { // if only bottom right is empty, sand can fall diagonally to the right
      this._swap(x, y, x + 1, y - 1);
    }
  }

  _swap(x1, y1, x2, y2) {
    const temp = this._cells[y1][x1];
    this._cells[y1][x1] = this._cells[y2][x2];
    this._cells[y2][x2] = temp;
  }
}

const CellSize = 5;
const sim = new FallingSandSimulation(100, 100);

function setup() {
  createCanvas(sim.width * CellSize, sim.height * CellSize);
  frameRate(30);
  colorMode(HSB, 360, 100, 100);
}

function addSands(extent = 1) {
  if (!mouseIsPressed) return;
  const mx = Math.floor(mouseX / CellSize);
  const my = Math.floor((height - mouseY) / CellSize);
  const e = extent - 1;
  for (let ex = -e; ex <= e; ex++) {
    for (let ey = -e; ey <= e; ey++) {
      const x = mx + ex;
      const y = my + ey;
      if (abs(ex) + abs(ey) <= e && x >= 0 && x < sim.width && y >= 0 && y < sim.height) {
        sim.setAt(x, y, new Sand(random(Number.MAX_SAFE_INTEGER)));
      }
    }
  }
}

function render() {
  background(0, 0, 0);
  noStroke();
  for (let yi = 0; yi < sim.height; yi++) {
    for (let xi = 0; xi < sim.width; xi++) {
      const cell = sim.getAt(xi, yi);
      if (cell) {
        fill(30, 50, 30 + cell.seed % 20);
        rect(CellSize * xi, height - CellSize * (yi + 1), CellSize, CellSize);
      }
    }
  }
}

function draw() {
  sim.update();
  addSands(3);
  render();
}