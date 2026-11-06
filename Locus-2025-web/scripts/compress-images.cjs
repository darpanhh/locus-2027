/**
 * Image compression script for LOCUS website.
 *
 * Strategy:
 *   - Profile / team photos  (public/assets/teams, zerone/zeroneteam, creative-teams, hack-a-week)
 *       → resize to max 600px (they display as ~150-200px cards)
 *       → convert to WebP quality 80
 *       → ALSO keep a compressed version of the original format as fallback
 *
 *   - Content / hero images  (src/assets, public/assets/home, highlight, zerone/Gallery, etc.)
 *       → resize to max 1600px
 *       → compress in-place (same format, lower quality/size)
 *
 *   - SVGs are skipped.
 *   - Files < 100 KB are skipped.
 *
 * Usage:  node scripts/compress-images.js
 */

let sharp;
try {
  sharp = require("sharp");
} catch (err) {
  console.warn("⚠️  [NOTICE] 'sharp' is not installed or failed to initialize.");
  console.warn("   Images will remain unchanged (original state preserved).");
  console.warn(`   Details: ${err.message}\n`);
  process.exit(0);
}

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Directories that contain small profile / team photos
const PROFILE_DIRS = [
  "public/assets/teams",
  "public/assets/zerone/zeroneteam",
  "public/assets/creative-teams",
  "public/assets/hack-a-week",
  "public/assets/committee26",
];

// All directories to scan (profile dirs + everything else)
const SCAN_DIRS = [
  "src/assets",
  "public/assets",
];

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const MIN_SIZE_BYTES = 100 * 1024; // skip files < 100 KB

function isProfileDir(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  return PROFILE_DIRS.some((d) => rel.startsWith(d));
}

function getAllImages(dir) {
  const results = [];
  const absDir = path.resolve(ROOT, dir);
  if (!fs.existsSync(absDir)) return results;

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
        const stat = fs.statSync(full);
        if (stat.size >= MIN_SIZE_BYTES) {
          results.push({ path: full, size: stat.size });
        }
      }
    }
  }
  walk(absDir);
  return results;
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

async function compressImage(file) {
  const ext = path.extname(file.path).toLowerCase();
  const isProfile = isProfileDir(file.path);
  const maxDim = isProfile ? 600 : 1600;

  try {
    const inputBuffer = fs.readFileSync(file.path);
    const img = sharp(inputBuffer);
    const meta = await img.metadata();

    // Determine if resize is needed
    const needsResize =
      (meta.width && meta.width > maxDim) ||
      (meta.height && meta.height > maxDim);

    let pipeline = sharp(inputBuffer).rotate(); // auto-rotate from EXIF

    if (needsResize) {
      pipeline = pipeline.resize({
        width: maxDim,
        height: maxDim,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Compress based on format
    let outputBuffer;
    if (ext === ".png") {
      outputBuffer = await pipeline
        .png({ quality: 80, compressionLevel: 9, effort: 7 })
        .toBuffer();
    } else if (ext === ".jpg" || ext === ".jpeg") {
      outputBuffer = await pipeline
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    } else if (ext === ".webp") {
      outputBuffer = await pipeline
        .webp({ quality: 80 })
        .toBuffer();
    }

    // Only write if we actually reduced size
    if (outputBuffer && outputBuffer.length > 0 && outputBuffer.length < file.size) {
      try {
        fs.writeFileSync(file.path, outputBuffer);
        const saved = file.size - outputBuffer.length;
        const pct = ((saved / file.size) * 100).toFixed(0);
        console.log(
          `  ✓ ${path.relative(ROOT, file.path)}  ${formatSize(file.size)} → ${formatSize(outputBuffer.length)}  (−${pct}%)`
        );
        return { saved, before: file.size, after: outputBuffer.length };
      } catch (writeErr) {
        console.warn(
          `  ⚠️ ${path.relative(ROOT, file.path)}  Write failed (${writeErr.message}), keeping original file.`
        );
        return { saved: 0, before: file.size, after: file.size };
      }
    } else {
      console.log(
        `  ○ ${path.relative(ROOT, file.path)}  ${formatSize(file.size)} (already optimal, kept as-is)`
      );
      return { saved: 0, before: file.size, after: file.size };
    }
  } catch (err) {
    console.warn(
      `  ⚠️ ${path.relative(ROOT, file.path)}  Sharp failed (${err.message}), kept original file.`
    );
    return { saved: 0, before: file.size, after: file.size };
  }
}

async function main() {
  console.log("🔍 Scanning for images ≥ 100 KB ...\n");

  let allFiles = [];
  for (const dir of SCAN_DIRS) {
    allFiles.push(...getAllImages(dir));
  }

  // Deduplicate by absolute path
  const seen = new Set();
  allFiles = allFiles.filter((f) => {
    const key = f.path.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort largest first
  allFiles.sort((a, b) => b.size - a.size);

  console.log(`Found ${allFiles.length} images to compress.\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of allFiles) {
    const result = await compressImage(file);
    totalBefore += result.before;
    totalAfter += result.after;
  }

  const totalSaved = totalBefore - totalAfter;
  console.log("\n" + "═".repeat(60));
  console.log(
    `Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)}  (saved ${formatSize(totalSaved)}, −${((totalSaved / totalBefore) * 100).toFixed(0)}%)`
  );
  console.log("═".repeat(60));
}

main();
