import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read .env.local if present
function loadLocalEnv() {
    const envPath = path.join(rootDir, '.env.local');
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                const [key, ...rest] = trimmed.split('=');
                const val = rest.join('=').trim();
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = val;
                }
            }
        }
    }
}

loadLocalEnv();

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastasia';
const DEFAULT_VOICE = 'en-US-JennyNeural';

// Parse CLI flags
const args = process.argv.slice(2);
const force = args.includes('--force');
const targetPairArg = args.find(a => a.startsWith('--pair='))?.split('=')[1]?.trim();
const targetIdArg = args.find(a => a.startsWith('--id='))?.split('=')[1]?.trim();
const customVoiceArg = args.find(a => a.startsWith('--voice='))?.split('=')[1]?.trim() || DEFAULT_VOICE;

const lasaPairsPath = path.join(rootDir, 'src', 'data', 'lasaPairs.json');
const pronunciationPath = path.join(rootDir, 'src', 'data', 'rawLasaSource_PRONUNCIATION_VERIFIED_SOURCES_FIXED.json');
const outputDir = path.join(rootDir, 'public', 'audio', 'lasa');
const manifestPath = path.join(rootDir, 'src', 'data', 'audioManifest.json');
const mappingPath = path.join(rootDir, 'src', 'data', 'audioMapping.json');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

if (!AZURE_SPEECH_KEY) {
    console.error('\n❌ ERROR: AZURE_SPEECH_KEY not found in environment or .env.local!');
    console.error('Please configure AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local before running generation.\n');
    process.exit(1);
}

const lasaPairsData = JSON.parse(fs.readFileSync(lasaPairsPath, 'utf8'));
const pronunciationData = fs.existsSync(pronunciationPath)
    ? JSON.parse(fs.readFileSync(pronunciationPath, 'utf8'))
    : [];

const pairs = Array.isArray(lasaPairsData.pairs) ? lasaPairsData.pairs : [];

console.log('================================================================');
console.log('   DUOCLONGO — AZURE AI SPEECH (RAW MODE) AUDIO GENERATOR');
console.log('================================================================');
console.log(`Region: ${AZURE_SPEECH_REGION}`);
console.log(`Voice:  ${customVoiceArg}`);
console.log(`Target: public/audio/lasa/`);
console.log(`Force:  ${force}`);
if (targetPairArg) console.log(`Filter: Pair "${targetPairArg}"`);
if (targetIdArg) console.log(`Filter: ID "${targetIdArg}"`);
console.log('----------------------------------------------------------------\n');

// Helper to sanitize clean synthesis input (Raw mode baseline)
function resolveRawSynthesisInput(drugObj) {
    if (!drugObj) return '';
    // Use canonical medication name (Tall Man or Brand if branded, else generic)
    const raw = (drugObj.isBrand ? (drugObj.brandName || drugObj.tallManName) : (drugObj.genericName || drugObj.tallManName)) || drugObj.displayName || '';
    // Strip any unexpected parentheticals to guarantee clean spoken term
    if (raw.includes('(') && raw.includes(')')) {
        return raw.replace(/\(.*?\)/g, '').trim();
    }
    return raw.trim();
}

async function synthesizeAzureRaw(text, voice) {
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="${voice}">
    ${text}
  </voice>
</speak>`.trim();

    const azureUrl = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const response = await fetch(azureUrl, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            'User-Agent': 'DuoclongoAudioPipeline'
        },
        body: ssml
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Azure HTTP ${response.status}: ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// Load existing manifest if present
let manifest = {};
if (fs.existsSync(manifestPath)) {
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
        manifest = {};
    }
}

let mapping = {};
if (fs.existsSync(mappingPath)) {
    try {
        mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
    } catch {
        mapping = {};
    }
}

let generatedCount = 0;
let skippedCount = 0;
let failedCount = 0;
let totalBytes = 0;

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

function addMappingAliases(mappingObj, canonicalId, fileName, item, displayName, relativeUrl) {
    mappingObj[canonicalId] = relativeUrl;
    const fileBase = fileName.replace(/\.mp3$/, '');
    mappingObj[fileBase] = relativeUrl;
    mappingObj[fileBase.toLowerCase()] = relativeUrl;

    const aliases = new Set();
    if (displayName) aliases.add(displayName);
    if (item.drug.genericName) aliases.add(item.drug.genericName);
    if (item.drug.tallManName) aliases.add(item.drug.tallManName);
    if (item.drug.brandName) aliases.add(item.drug.brandName);

    // If displayName has parenthetical (e.g. "CeleBREX (celecoxib)")
    if (displayName && displayName.includes('(')) {
        const cleanName = displayName.replace(/\s*\([^)]*\)/, '').trim();
        if (cleanName) aliases.add(cleanName);
        const parenMatch = displayName.match(/\(([^)]+)\)/);
        if (parenMatch && parenMatch[1]) aliases.add(parenMatch[1].trim());
    }

    for (const alias of aliases) {
        if (!alias) continue;
        const trimmed = alias.trim();
        mappingObj[trimmed] = relativeUrl;
        mappingObj[trimmed.toLowerCase()] = relativeUrl;
    }
}

async function run() {
    for (const pair of pairs) {
        if (targetPairArg && pair.id !== targetPairArg) continue;

        const pronRecord = pronunciationData.find(p => p.id === pair.numericId || p.id === pair.id) || {};

        const items = [
            {
                side: 'a',
                sideUpper: 'A',
                drug: pair.drugA,
                pronunciation: pronRecord.pronunciation_1 || '',
                source: typeof pronRecord.pronunciation_source === 'object'
                    ? pronRecord.pronunciation_source?.drug_1
                    : pronRecord.pronunciation_source || '',
                verified: pronRecord.VERIFIED || 'NO'
            },
            {
                side: 'b',
                sideUpper: 'B',
                drug: pair.drugB,
                pronunciation: pronRecord.pronunciation_2 || '',
                source: typeof pronRecord.pronunciation_source === 'object'
                    ? pronRecord.pronunciation_source?.drug_2
                    : pronRecord.pronunciation_source || '',
                verified: pronRecord.VERIFIED || 'NO'
            }
        ];

        for (const item of items) {
            const canonicalId = `${pair.id}_${item.side}`;
            if (targetIdArg && canonicalId !== targetIdArg) continue;

            const fileName = getDescriptiveFileName(pair, item.drug);
            const filePath = path.join(outputDir, fileName);
            const relativeUrl = `/audio/lasa/${fileName}`;

            const rawSynthesisInput = resolveRawSynthesisInput(item.drug);
            const displayName = item.drug?.displayName || item.drug?.tallManName || rawSynthesisInput;

            // Check if file already exists
            const fileExists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;

            if (fileExists && !force) {
                const stat = fs.statSync(filePath);
                totalBytes += stat.size;
                skippedCount++;
                console.log(`  [SKIPPED] ${canonicalId.padEnd(12)} (${displayName}) -> Already exists (${fileName}, ${(stat.size / 1024).toFixed(1)} KB)`);

                // Ensure manifest & mapping are up to date
                addMappingAliases(mapping, canonicalId, fileName, item, displayName, relativeUrl);

                if (!manifest[canonicalId]) {
                    manifest[canonicalId] = {
                        pairId: pair.id,
                        numericId: pair.numericId,
                        side: item.sideUpper,
                        medicationName: displayName,
                        genericName: item.drug.genericName || displayName,
                        referencePronunciation: item.pronunciation,
                        pronunciationSource: item.source,
                        verified: item.verified,
                        audioFile: relativeUrl,
                        format: 'mp3',
                        synthesisInput: rawSynthesisInput,
                        synthesisMode: 'RAW',
                        voice: customVoiceArg,
                        locale: 'en-US',
                        provider: 'Azure AI Speech',
                        fileSizeBytes: stat.size,
                        generatedAt: new Date().toISOString()
                    };
                }
                continue;
            }

            // Synthesize via Azure Raw
            try {
                process.stdout.write(`  [GENERATING] ${canonicalId.padEnd(12)} (${displayName}) [raw: "${rawSynthesisInput}"] ... `);
                const buffer = await synthesizeAzureRaw(rawSynthesisInput, customVoiceArg);
                fs.writeFileSync(filePath, buffer);
                totalBytes += buffer.length;
                generatedCount++;
                console.log(`✓ DONE (${(buffer.length / 1024).toFixed(1)} KB)`);

                // Record into Manifest
                manifest[canonicalId] = {
                    pairId: pair.id,
                    numericId: pair.numericId,
                    side: item.sideUpper,
                    medicationName: displayName,
                    genericName: item.drug.genericName || displayName,
                    referencePronunciation: item.pronunciation,
                    pronunciationSource: item.source,
                    verified: item.verified,
                    audioFile: relativeUrl,
                    format: 'mp3',
                    synthesisInput: rawSynthesisInput,
                    synthesisMode: 'RAW',
                    voice: customVoiceArg,
                    locale: 'en-US',
                    provider: 'Azure AI Speech',
                    fileSizeBytes: buffer.length,
                    generatedAt: new Date().toISOString()
                };

                // Record into Mapping
                addMappingAliases(mapping, canonicalId, fileName, item, displayName, relativeUrl);

                // Brief rate-limit protection delay (100ms)
                await new Promise(r => setTimeout(r, 100));
            } catch (err) {
                failedCount++;
                console.log(`❌ FAILED: ${err.message}`);
            }
        }
    }

    // Save updated manifest & mapping
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

    console.log('\n================================================================');
    console.log('   GENERATION SUMMARY');
    console.log('================================================================');
    console.log(`Total Applicable Items: ${pairs.length * 2}`);
    console.log(`Successfully Generated: ${generatedCount}`);
    console.log(`Skipped (Existed):      ${skippedCount}`);
    console.log(`Failed:                 ${failedCount}`);
    console.log(`Total Audio Assets:     ${generatedCount + skippedCount}`);
    console.log(`Total Asset Size:       ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Manifest File:          src/data/audioManifest.json`);
    console.log(`Mapping File:           src/data/audioMapping.json`);
    console.log('================================================================\n');

    if (failedCount > 0) {
        process.exit(1);
    }
}

run().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});
