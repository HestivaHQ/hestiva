import { access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const collections = [
  {
    directory: "public/images/services",
    widths: [480, 768, 1200],
    names: [
      "regular-home-cleaning",
      "deep-cleaning",
      "move-in-cleaning",
      "move-out-cleaning",
      "kitchen-cleaning",
      "bathroom-sanitisation",
      "bedroom-cleaning",
      "living-area-cleaning",
      "interior-window-cleaning",
      "laundry-folding",
      "apartment-cleaning",
      "eco-conscious-cleaning",
    ],
  },
  {
    directory: "public/images/add-ons",
    widths: [384, 640, 960],
    names: [
      "inside-fridge-cleaning",
      "inside-oven-cleaning",
      "interior-cupboard-cleaning",
      "extra-laundry-folding",
      "balcony-sweeping",
      "additional-room-cleaning",
    ],
  },
];

for (const collection of collections) {
  for (const name of collection.names) {
    const source = path.resolve(`${collection.directory}/${name}.png`);
    await access(source);
    for (const width of collection.widths) {
      const output = path.resolve(`${collection.directory}/${name}-${width}.webp`);
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toFile(output);
      console.log(path.relative(process.cwd(), output));
    }
  }
}
