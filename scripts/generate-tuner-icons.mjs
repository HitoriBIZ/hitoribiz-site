import fs from "fs";
import path from "path";
import sharp from "sharp";

const input = path.join(process.cwd(), "public", "icons", "tuner", "tuner-icon-1024.png");
const outputDir = path.join(process.cwd(), "public", "icons", "tuner");

if (!fs.existsSync(input)) {
  console.error("Source icon not found:", input);
  process.exit(1);
}

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

async function run() {
  for (const item of sizes) {
    const outPath = path.join(outputDir, item.name);

    await sharp(input)
      .resize(item.size, item.size)
      .png()
      .toFile(outPath);

    console.log(`Generated: ${outPath}`);
  }

  console.log("All tuner icons generated successfully.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});