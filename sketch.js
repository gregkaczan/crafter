// Declare variables
let pixelSize = 13; // Size of each grid cell
let currentColor = "#000000"; // Default color to draw with
let eraserColor = "#FFFFFF";
let isDrawing = false; // Flag to indicate if user is currently drawing
let colors = [
  "#8B4513", // Wood
  "#A9A9A9", // Stone
  "#A0522D", // Leather
  "#43464B", // Iron
  "#B87333", // Copper
  "#F5DEB3", // Fabric
  "#FFFFFF", // Eraser
]; // Array of available colors
let buttonWidth = 50; // Width of color selector and reset buttons
let buttonHeight = 50; // Height of color selector and reset buttons

function setup() {
  // Create canvas and set its dimensions
  createCanvas(600, 400);
  
  document.querySelector('canvas').addEventListener('contextmenu', e => e.preventDefault());
  
  slider = createSlider(5, 20, pixelSize);
  slider.position(10, height + 20);
  slider.input(resetGrid);

  // Set color mode to use RGB values (0-255)
  colorMode(RGB, 255);

  // Create grid by calculating number of rows and columns based on canvas dimensions and pixel size
  let numRows = floor(height / pixelSize);
  let numCols = floor(width / pixelSize);

  // Create 2D array to store color values for each cell in the grid
  grid = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    grid[i] = new Array(numCols);
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = color(255); // Set default color to white
    }
  }

  // Create color selector buttons on the left side of the canvas
  for (let i = 0; i < colors.length; i++) {
    let buttonX = 20;
    let buttonY = i * buttonHeight;
    let button = createButton("");
    button.position(buttonX, buttonY + 20);
    button.size(buttonWidth, buttonHeight);
    button.style("background-color", colors[i]);
    button.mousePressed(() => {
      currentColor = colors[i];
    });
  }

  // Create reset button at bottom left of canvas
  let resetButtonX = 20;
  let resetButtonY = height - buttonHeight;
  let resetButton = createButton("Reset");
  resetButton.position(resetButtonX, resetButtonY  +20);
  resetButton.size(buttonWidth, buttonHeight);
  resetButton.mousePressed(() => {
    // Reset grid to default colors
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j] = color(255);
      }
    }
  });
}

function resetGrid() {
  pixelSize = slider.value();
  let numRows = floor(height / pixelSize);
  let numCols = floor(width / pixelSize);
  grid = createEmptyGrid(numRows, numCols);
}

function createEmptyGrid(rows, cols) {
  let emptyGrid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    emptyGrid[i] = new Array(cols);
    emptyGrid[i].fill(color(255));
  }
  return emptyGrid;
}

function draw() {
  // Draw grid by looping through 2D array and drawing each cell with its color
  strokeWeight(1);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let x = j * pixelSize;
      let y = i * pixelSize;
      fill(grid[i][j]);
      stroke(200);
      rect(x, y, pixelSize, pixelSize);
    }
  }

  // Draw rectangle around current color to indicate selection
  noFill();
  stroke(255);
  strokeWeight(3);
  let currentColorIndex = getCurrentColorIndex();
  let currentColorY = currentColorIndex * buttonHeight;
  rect(0, currentColorY, buttonWidth, buttonHeight);
}

function getCurrentColorIndex() {
  // Helper function to get index of current color in color array
  for (let i = 0; i < colors.length; i++) {
    if (currentColor === colors[i]) {
      return i;
    }
  }
  return -1; // Current color not found in array
}

function mousePressed() {
  if (mouseButton === LEFT) {
    isEraser = false;
  } else if (mouseButton === RIGHT) {
    isEraser = true
  }
  
  isDrawing = true;
}

function mouseDragged() {
  // Draw cell at mouse position if user is currently drawing
  if (isDrawing) {
    drawCellAtMousePos();
  }
}

function mouseReleased() {
  // Update isDrawing flag to indicate user has stopped drawing
  isDrawing = false;
}

function drawCellAtMousePos() {
  // Helper function to draw cell at current mouse position with current color
  let drawColor = isEraser ? eraserColor : currentColor;
  let row = floor(mouseY / pixelSize);
  let col = floor(mouseX / pixelSize);
  if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
    grid[row][col] = color(drawColor);
  }
}
