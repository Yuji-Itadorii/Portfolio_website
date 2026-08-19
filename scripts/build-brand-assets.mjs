/**
 * Generates the favicon raster set and the social preview card.
 *
 * Like the hero pipeline this is a one-shot: run `npm run brand`, commit the
 * output, and leave it out of the deploy build.
 *
 * The OG card is composed as SVG and rasterised by sharp — no headless browser,
 * no satori/resvg dependency pair for what is ultimately one static PNG.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_DIR = path.join(ROOT, "public");

const ACCENT = "#F97316";
const SURFACE = "#0D1117";
const TEXT_1 = "#F2F5F8";
const TEXT_3 = "#8B96A4";

const MONOGRAM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#C2410C"/>
  <text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF"
    font-family="monospace" font-size="27" font-weight="700">AR</text>
</svg>`;

const METRICS = [
  ["35%", "faster delivery"],
  ["20%", "faster APIs"],
  ["10%", "lower cost"],
];

function ogCard() {
  const metricGroup = METRICS.map(([value, label], i) => {
    const x = 80 + i * 220;
    return `
      <text x="${x}" y="486" fill="${ACCENT}" font-family="monospace" font-size="52"
        font-weight="700">${value}</text>
      <text x="${x}" y="522" fill="${TEXT_3}" font-family="sans-serif" font-size="20">${label}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.20"/>
      <stop offset="60%" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="${SURFACE}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="${ACCENT}"/>

  <rect x="80" y="86" width="52" height="52" rx="12" fill="#C2410C"/>
  <text x="106" y="120" text-anchor="middle" fill="#FFFFFF" font-family="monospace"
    font-size="22" font-weight="700">AR</text>

  <text x="80" y="248" fill="${TEXT_1}" font-family="sans-serif" font-size="82"
    font-weight="700" letter-spacing="-2">Abhay Rawat</text>

  <text x="80" y="312" fill="${ACCENT}" font-family="sans-serif" font-size="34"
    font-weight="600">Backend &amp; AI Engineer</text>

  <text x="80" y="372" fill="${TEXT_3}" font-family="sans-serif" font-size="26">
    Software Engineer at Paytm · Node.js · Spring Boot · Agentic LLM tooling
  </text>

  <rect x="80" y="418" width="1040" height="1" fill="#26303C"/>
  ${metricGroup}
</svg>`;
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  const monogram = Buffer.from(MONOGRAM_SVG);

  for (const size of [180, 192, 512]) {
    const name = size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
    await sharp(monogram, { density: 384 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, name));
  }

  // .ico: a 32x32 PNG payload is accepted by every browser that still asks for
  // favicon.ico, and avoids pulling in an ICO encoder for one file.
  const ico = await sharp(monogram, { density: 384 }).resize(32, 32).png().toBuffer();
  await writeFile(path.join(PUBLIC_DIR, "favicon.ico"), ico);

  await sharp(Buffer.from(ogCard()), { density: 144 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC_DIR, "og.png"));

  console.log("  favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, og.png ✓");
}

await main();
