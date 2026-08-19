/**
 * Minimal static file server for `dist/`.
 *
 * Exists for two reasons:
 *
 * 1. `astro preview` daemonises itself when stdout isn't a TTY, so Playwright's
 *    `webServer` sees the process exit immediately and gives up.
 * 2. Serving the build through a dumb file server is exactly what Render's
 *    Static Site does. If the suite passes against this, it will pass in
 *    production — an `astro preview` pass proves slightly less.
 *
 * Zero dependencies, foreground, honours SIGTERM.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createBrotliCompress, createGzip } from "node:zlib";
import path from "node:path";

const ROOT = fileURLToPath(new URL("../dist", import.meta.url));
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

/** Resolve a URL path to a file inside dist/, or null. */
async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates =
    clean === "/"
      ? ["index.html"]
      : [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`];

  for (const candidate of candidates) {
    const full = path.join(ROOT, candidate);
    // Refuse anything that escapes dist/.
    if (!full.startsWith(ROOT)) continue;
    try {
      const info = await stat(full);
      if (info.isFile()) return full;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

const server = createServer((req, res) => {
  void (async () => {
    const file = await resolve(req.url ?? "/");

    if (!file) {
      const notFound = path.join(ROOT, "404.html");
      try {
        await stat(notFound);
        res.writeHead(404, { "Content-Type": TYPES[".html"] });
        createReadStream(notFound).pipe(res);
        return;
      } catch {
        res.writeHead(404, { "Content-Type": TYPES[".txt"] });
        res.end("Not found");
        return;
      }
    }

    const ext = path.extname(file);
    const headers = {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    };

    // Compress text responses. Render (and any real host) does this; without
    // it a local Lighthouse run reports roughly 75% more bytes than production
    // actually ships and scores the site far worse than it deserves.
    const encoding = negotiate(req.headers["accept-encoding"], ext);
    if (encoding) {
      headers["Content-Encoding"] = encoding;
      headers.Vary = "Accept-Encoding";
      res.writeHead(200, headers);
      const compressor = encoding === "br" ? createBrotliCompress() : createGzip();
      createReadStream(file).pipe(compressor).pipe(res);
      return;
    }

    res.writeHead(200, headers);
    createReadStream(file).pipe(res);
  })();
});

/** Images and fonts are already compressed; re-encoding them only wastes CPU. */
const COMPRESSIBLE = new Set([
  ".html",
  ".css",
  ".js",
  ".json",
  ".webmanifest",
  ".xml",
  ".svg",
  ".txt",
]);

function negotiate(acceptEncoding, ext) {
  if (!COMPRESSIBLE.has(ext)) return null;
  const accepted = String(acceptEncoding ?? "");
  if (accepted.includes("br")) return "br";
  if (accepted.includes("gzip")) return "gzip";
  return null;
}

server.listen(PORT, () => {
  console.log(`Serving dist/ at http://localhost:${PORT}`);
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
