import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const lasaPairsPath = path.join(rootDir, 'src', 'data', 'lasaPairs.json');
const outputDir = path.join(rootDir, 'public', 'audio', 'lasa');
const manifestPath = path.join(rootDir, 'src', 'data', 'audioManifest.json');
const mappingPath = path.join(rootDir, 'src', 'data', 'audioMapping.json');

console.log('================================================================');
console.log('   DUOCLONGO — LASA AUDIO ASSET AUDIT & VALIDATION');
console.log('================================================================\n');

if (!fs.existsSync(lasaPairsPath)) {
    console.error('❌ Missing lasaPairs.json!');
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    console.error('❌ Missing audio directory: public/audio/lasa/');
    process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
    console.error('❌ Missing audio manifest: src/data/audioManifest.json');
    process.exit(1);
}

if (!fs.existsSync(mappingPath)) {
    console.error('❌ Missing audio mapping: src/data/audioMapping.json');
    process.exit(1);
}

const lasaData = JSON.parse(fs.readFileSync(lasaPairsPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

const pairs = Array.isArray(lasaData.pairs) ? lasaData.pairs : [];
const expectedCount = pairs.length * 2;

let validCount = 0;
let missingFiles = [];
let emptyFiles = [];
let missingManifest = [];
let missingMapping = [];
let totalSize = 0;

function cleanMedName(drug) {
    let name = drug.genericName || drug.tallManName || drug.displayName || '';
    if (drug.isBrand && drug.brandName) {
        name = drug.brandName;
    } else if (drug.displayName && drug.displayName.includes('(')) {
        name = drug.displayName.replace(/\s*\(.*?\)/, '');
    }
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function getDescriptiveFileName(pair, drug) {
    const num = String(pair.numericId).padStart(3, '0');
    const cleanMed = cleanMedName(drug);
    return `lasa${num}_${cleanMed}.mp3`;
}

for (const pair of pairs) {
    const sides = [
        { side: 'a', drug: pair.drugA },
        { side: 'b', drug: pair.drugB }
    ];

    for (const item of sides) {
        const canonicalId = `${pair.id}_${item.side}`;
        const fileName = getDescriptiveFileName(pair, item.drug);
        const filePath = path.join(outputDir, fileName);

        // Check file existence
        if (!fs.existsSync(filePath)) {
            missingFiles.push({ id: canonicalId, file: fileName });
            continue;
        }

        const stat = fs.statSync(filePath);
        if (stat.size < 1000) {
            emptyFiles.push({ id: canonicalId, file: fileName, size: stat.size });
            continue;
        }

        totalSize += stat.size;

        // Check manifest
        const entry = manifest[canonicalId];
        if (!entry || !entry.medicationName || !entry.audioFile || entry.synthesisMode !== 'RAW') {
            missingManifest.push(canonicalId);
        }

        // Check mapping
        if (!mapping[canonicalId]) {
            missingMapping.push(canonicalId);
        }

        validCount++;
    }
}

// Check for orphaned files
const diskFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.mp3'));
const expectedFileNames = new Set(pairs.flatMap(p => [
    getDescriptiveFileName(p, p.drugA),
    getDescriptiveFileName(p, p.drugB)
]));
const orphanedFiles = diskFiles.filter(f => !expectedFileNames.has(f));

console.log(`Audited Canonical Pairs:   ${pairs.length}`);
console.log(`Required Audio Clips:      ${expectedCount}`);
console.log(`Valid Generated Files:     ${validCount}`);
console.log(`Total Audio Assets Size:   ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Orphaned Files Detected:   ${orphanedFiles.length}`);

let passed = true;

if (missingFiles.length > 0) {
    console.error(`\n❌ Missing ${missingFiles.length} audio file(s):`, missingFiles);
    passed = false;
}

if (emptyFiles.length > 0) {
    console.error(`\n❌ Found ${emptyFiles.length} empty or corrupted file(s):`, emptyFiles);
    passed = false;
}

if (missingManifest.length > 0) {
    console.error(`\n❌ Missing or invalid manifest entries for ${missingManifest.length} item(s):`, missingManifest);
    passed = false;
}

if (missingMapping.length > 0) {
    console.error(`\n❌ Missing runtime mappings for ${missingMapping.length} item(s):`, missingMapping);
    passed = false;
}

if (orphanedFiles.length > 0) {
    console.warn(`\n⚠️ Warning: Orphaned files in audio directory:`, orphanedFiles);
}

if (passed) {
    console.log('\n================================================================');
    console.log('✅ ALL AUDIO VALIDATION CHECKS PASSED FLAWLESSLY! (100% COVERAGE)');
    console.log('================================================================\n');
    process.exit(0);
} else {
    console.error('\n================================================================');
    console.error('❌ AUDIO VALIDATION FAILED!');
    console.error('================================================================\n');
    process.exit(1);
}
