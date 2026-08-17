import { existsSync } from "node:fs";
import path from "node:path";

export const RESUME_FILENAME = "Abhay_Rawat_Resume.pdf";
export const RESUME_PATH = `/${RESUME_FILENAME}`;

/**
 * Build-time check so a missing PDF is loud in the terminal and degrades to an
 * email link in the UI, rather than shipping a download that 404s.
 *
 * Resolved from process.cwd() (the project root, where Astro runs) rather than
 * import.meta.url: this module gets bundled into the SSR entry at build time,
 * so import.meta.url points at the emitted chunk, not at src/lib/ — which made
 * the check report "missing" even when the file was present.
 */
export const resumeExists = existsSync(path.join(process.cwd(), "public", RESUME_FILENAME));

if (!resumeExists) {
  console.warn(
    `\n  [portfolio] public/${RESUME_FILENAME} is missing.\n` +
      `  The resume CTA will fall back to an email link.\n` +
      `  Drop the PDF at that path and rebuild to enable it.\n`,
  );
}
