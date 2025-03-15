const { build } = require('esbuild');
const { copy } = require('esbuild-plugin-copy');
const path = require('path');

async function buildBundle() {
  try {
    // Clean the output directory (optional)
    // require('fs').rmSync(path.resolve(__dirname, 'dist'), { recursive: true, force: true });

    // Build with esbuild
    const result = await build({
      entryPoints: ['src/app.ts'],
      bundle: true,
      minify: false,
      sourcemap: true,
      platform: 'node',
      target: 'node18',
      outdir: path.resolve(__dirname, 'dist'),
      external: ['aws-sdk'],
      metafile: true,
      plugins: [
        // Copy node_modules that can't be bundled if needed
        copy({
          assets: [
            {
              from: ['node_modules/node-fetch/**/*'],
              to: ['./node_modules/node-fetch'],
            },
          ],
        }),
      ],
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildBundle();