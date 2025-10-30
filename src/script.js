const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./assets/enMc.jpg";

const density = "Ñ@#W$?!;:+=-.";

const inputSlider = document.getElementById("resolution");
const inputLabel = document.getElementById("resolutionText");
inputSlider.addEventListener("input", handleSliderChange);
downloadBtn.addEventListener("click", downloadImage);

class Cell {
  constructor(x, y, color, symbol) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.symbol = symbol;
  }
  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillText(this.symbol, this.x + 0.5, this.y + 0.5);
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, this.x, this.y);
  }
}

class AsciiEffect {
  #imageCellArray = [];
  #asciiArray = [];
  #pixels = "";
  #ctx;
  #width;
  #height;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;

    this.#ctx.drawImage(img, 0, 0, this.#width, this.#height);
    this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    console.log(this.#pixels.data);
  }
  #convertToSymbol(g) {
    if (g > 250) return "Ñ";
    else if (g > 240) return "@";
    else if (g > 220) return "#";
    else if (g > 200) return "W";
    else if (g > 180) return "$";
    else if (g > 160) return "9";
    else if (g > 140) return "!";
    else if (g > 120) return ";";
    else if (g > 100) return ":";
    else if (g > 80) return "+";
    else if (g > 60) return "=";
    else if (g > 40) return "-";
    else if (g > 20) return ".";
    else return " ";
  }
  #scanImage(cellSize) {
    this.#imageCellArray = [];

    for (let y = 0; y < this.#pixels.height; y += cellSize) {
      for (let x = 0; x < this.#pixels.width; x += cellSize) {
        const posX = x * 4;
        const posY = y * 4;
        const pos = posY * this.#pixels.width + posX;

        if (this.#pixels.data[pos + 3] > 128) {
          const red = this.#pixels.data[pos];
          const green = this.#pixels.data[pos + 1];
          const blue = this.#pixels.data[pos + 2];
          const total = red + green + blue;
          const average = total / 3;
          const color = `rgb(${red}, ${green}, ${blue})`;
          const symbol = this.#convertToSymbol(average);
          if (total > 200)
            this.#imageCellArray.push(new Cell(x, y, color, symbol));
        }
      }
    }
    console.log(this.#imageCellArray);
  }
  #drawAscii() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    for (let i = 0; i < this.#imageCellArray.length; i++) {
      this.#imageCellArray[i].draw(this.#ctx);
    }
  }
  draw(cellSize) {
    this.#scanImage(cellSize);
    this.#drawAscii();
  }
}

let effect;

function handleSliderChange() {
  if (parseInt(inputSlider.value) == 1) {
    inputLabel.innerHTML = "Original Image";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    inputLabel.innerHTML = "Resolution " + parseInt(inputSlider.value) + " px";
    ctx.font = parseInt(inputSlider.value) * 1.2 + "px serif";
    effect.draw(parseInt(inputSlider.value));
  }
}

img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  effect = new AsciiEffect(ctx, img.width, img.height);
  handleSliderChange();
};

// Función para descargar la imagen
function downloadImage() {
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

img.onerror = function () {
  console.error("Error al cargar la imagen.");
};
