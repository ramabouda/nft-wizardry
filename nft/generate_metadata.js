const fs = require("fs");

const numberOfFiles = 80;
const outputPath = "./metadata/";

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomBoolean() {
  return Math.random() < 0.5;
}

function generateRandomClass() {
  const classes = ["Warrior", "Mage", "Rogue", "Paladin", "Archer"];
  return classes[Math.floor(Math.random() * classes.length)];
}

function generateRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateLOTRName() {
  const names = [
    "Aragalad",
    "Gandiron",
    "Frothalion",
    "Legofir",
    "Gimlorin",
    "Boromis",
    "Samwindor",
    "Meriaduin",
    "Pippinger",
    "Golluvar",
    "Elrandor",
    "Glorothor",
    "Bilbion",
    "Thorondir",
    "Galador",
    "Eowiniel",
    "Eomendil",
    "Treebor",
    "Grimalion",
    "Saruvor",
  ];

  const prefixes = [
    "the Brave",
    "the Wise",
    "the Valiant",
    "the Bold",
    "the Magnificent",
    "the Fearless",
    "the Wise",
    "the Cunning",
    "the Noble",
    "the Mighty",
  ];
  const suffixes = [
    "of Gondor",
    "of the Shire",
    "of Rivendell",
    "of Mirkwood",
    "of Isengard",
    "of Rohan",
    "of Lothlorien",
    "of the Nine Walkers",
    "of the White Council",
    "of the Fellowship",
  ];

  const randomName = generateRandomElement(names);
  const randomPrefix = generateRandomElement(prefixes);
  const randomSuffix = generateRandomElement(suffixes);

  return `${randomName} ${randomPrefix} ${randomSuffix}`;
}

function generateLOTRDescription() {
  const adjectives = [
    "Tall",
    "Brave",
    "Wise",
    "Fearless",
    "Kind",
    "Strong",
    "Noble",
    "Swift",
    "Mysterious",
    "Mighty",
  ];
  const places = [
    "west",
    "east",
    "north",
    "south",
    "Mordor",
    "Rivendell",
    "Gondor",
    "Shire",
    "Isengard",
    "Mirkwood",
  ];
  const titles = [
    "king",
    "lord",
    "warrior",
    "ranger",
    "hobbit",
    "elf",
    "dwarf",
    "wizard",
  ];
  const races = ["human", "hobbit", "elf", "dwarf", "wizard"];
  const natures = [
    "mysterious",
    "graceful",
    "courageous",
    "wise",
    "loyal",
    "cheerful",
    "fearless",
    "curious",
    "gentle",
    "noble",
  ];
  const characters = [
    "adventurer",
    "guardian",
    "protector",
    "seeker",
    "champion",
    "scholar",
    "wanderer",
  ];

  const randomAdjective = generateRandomElement(adjectives);
  const randomPlace = generateRandomElement(places);
  const randomTitle = generateRandomElement(titles);
  const randomNature = generateRandomElement(natures);
  const randomCharacter = generateRandomElement(characters);

  return `A ${randomAdjective.toLowerCase()} hero from the ${randomPlace} known as ${randomTitle}, a ${randomNature.toLowerCase()} ${randomCharacter.toLowerCase()} of ${generateRandomElement(
    races
  )}.`;
}

const path = require("path");

function getRandomFileNameFromFolder(folderPath) {
  const files = fs
    .readdirSync(folderPath)
    .filter((name) => !name.startsWith("."));
  if (files.length === 0) {
    throw new Error("Folder is empty.");
  }

  const randomIndex = Math.floor(Math.random() * files.length);
  return files[randomIndex];
}

function generateData() {
  const data = {
    name: generateLOTRName(),
    description: generateLOTRDescription(),
    image_url: `https://gateway.pinata.cloud/ipfs/QmVa2vmYwTKk398ck7HZXREUFXB35A2C1wVCAQqTF4z6tQ/${getRandomFileNameFromFolder(
      "./images"
    )}`,
    attack: generateRandomNumber(1, 10),
    collectable: generateRandomBoolean(),
    class: generateRandomClass(),
  };
  return JSON.stringify(data, null, 2);
}

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

for (let i = 1; i <= numberOfFiles; i++) {
  const fileName = `${outputPath}${i}`;
  const jsonData = generateData();
  fs.writeFileSync(fileName, jsonData);
}

console.log("Files generated successfully.");
