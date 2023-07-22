const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

async function splitSpritesheet(inputImagePath, tileSize) {
  try {
    const spritesheet = await Jimp.read(inputImagePath);
    const numCols = Math.floor(spritesheet.getWidth() / tileSize.width) - 1;
    const numRows = Math.floor(spritesheet.getHeight() / tileSize.height) - 1;

    if (!fs.existsSync("output")) {
      fs.mkdirSync("output");
    }

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = col * tileSize.width + 31;
        const y = row * tileSize.height + 31;
        const tile = spritesheet
          .clone()
          .crop(x, y, tileSize.width, tileSize.height);
        const outputPath = `./images/tile_${row * numCols + col}.png`;
        await tile.writeAsync(outputPath);
        console.log(`Tile ${row}_${col} saved to ${outputPath}`);
      }
    }

    console.log("Spritesheet splitting complete!");
  } catch (error) {
    console.error("Error splitting spritesheet:", error);
  }
}

const inputImagePath = "../images/tileset.png";
const tileSize = { width: 104, height: 127 };
splitSpritesheet(inputImagePath, tileSize);
