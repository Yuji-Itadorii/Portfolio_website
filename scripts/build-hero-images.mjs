/**
 * One-shot hero image pipeline.
 *
 * Reads the twelve original parallax PNGs from src/assets/hero-src/ and emits
 * AVIF / WebP / PNG at three widths into public/hero/.
 *
 * Run once with `npm run images` and COMMIT the output. This is deliberately
 * not part of the Render build command — the inputs never change, so there is
 * no reason to burn build minutes regenerating byte-identical files.
 *
 * The originals are 1920x1080 except 4.png (1897x1075), so every layer is
 * force-resized to the canonical size first; otherwise that one layer sits a
 * fraction off and shows a seam against its neighbours.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC_DIR = path.join(ROOT, "src", "assets", "hero-src");
const OUT_DIR = path.join(ROOT, "public", "hero");

const LAYER_COUNT = 12;
const CANONICAL = { width: 1920, height: 1080 };
const WIDTHS = [640, 1024, 1920];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (let id = 0; id < LAYER_COUNT; id += 1) {
    const input = path.join(SRC_DIR, `${id}.png`);
    const base = sharp(input).resize(CANONICAL.width, CANONICAL.height, { fit: "cover" });

    for (const width of WIDTHS) {
      const sized = base.clone().resize({ width, withoutEnlargement: false });

      await sized
        .clone()
        .avif({ quality: 50, effort: 7 })
        .toFile(path.join(OUT_DIR, `${id}-${width}.avif`));

      await sized
        .clone()
        .webp({ quality: 72, effort: 6 })
        .toFile(path.join(OUT_DIR, `${id}-${width}.webp`));

      await sized
        .clone()
        .png({ compressionLevel: 9, palette: true })
        .toFile(path.join(OUT_DIR, `${id}-${width}.png`));
    }

    process.stdout.write(`  layer ${String(id).padStart(2)} ✓\n`);
  }

  await report();
}

async function report() {
  const files = await readdir(OUT_DIR);
  const totals = new Map();

  for (const file of files) {
    const match = /-(\d+)\.(avif|webp|png)$/.exec(file);
    if (!match) continue;
    const key = `${match[2]} @ ${match[1]}w`;
    const { size } = await stat(path.join(OUT_DIR, file));
    totals.set(key, (totals.get(key) ?? 0) + size);
  }

  console.log(`\n  ${files.length} files in public/hero/\n`);
  for (const key of [...totals.keys()].sort()) {
    const kb = (totals.get(key) / 1024).toFixed(1);
    console.log(`    ${key.padEnd(14)} ${kb.padStart(7)} KB  (12 layers)`);
  }
  console.log("");
}

await main();
