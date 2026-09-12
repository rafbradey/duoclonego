import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'node:buffer';

/**
 * Dev-only middleware plugin for testing Azure AI Speech in /test-tts.
 * Keeps Azure API credentials securely in the Node.js dev environment.
 */
function azureTtsDevPlugin() {
  return {
    name: 'azure-tts-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Status endpoint: reports if key & region are set without exposing key value
        if (req.url?.startsWith('/api/dev-tts/status')) {
          const env = loadEnv(server.config.mode, server.config.root, '');
          const hasKey = Boolean(env.AZURE_SPEECH_KEY);
          const region = env.AZURE_SPEECH_REGION || 'not set';
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ configured: hasKey, region }));
          return;
        }

        // Audio synthesis endpoint
        if (req.url?.startsWith('/api/dev-tts/azure') && req.method === 'POST') {
          try {
            const env = loadEnv(server.config.mode, server.config.root, '');
            const key = env.AZURE_SPEECH_KEY;
            const region = env.AZURE_SPEECH_REGION;

            if (!key || !region) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'AZURE_SPEECH_KEY or AZURE_SPEECH_REGION not configured in .env.local' }));
              return;
            }

            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const body = JSON.parse(Buffer.concat(buffers).toString());
            const { text, voice = 'en-US-JennyNeural', rate = '0%', pitch = '0%' } = body;

            // Construct standard SSML for Azure Neural TTS
            const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="${voice}">
    <prosody rate="${rate}" pitch="${pitch}">
      ${text}
    </prosody>
  </voice>
</speak>`.trim();

            const azureUrl = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
            const azureRes = await fetch(azureUrl, {
              method: 'POST',
              headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
                'User-Agent': 'DuoclongoDevTest'
              },
              body: ssml
            });

            if (!azureRes.ok) {
              const errText = await azureRes.text();
              res.statusCode = azureRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `Azure Speech error: ${azureRes.status}`, details: errText }));
              return;
            }

            const arrayBuffer = await azureRes.arrayBuffer();
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Length', arrayBuffer.byteLength);
            res.end(Buffer.from(arrayBuffer));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), azureTtsDevPlugin()]
});
