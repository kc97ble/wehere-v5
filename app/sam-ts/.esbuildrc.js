module.exports = {
  target: 'node18',
  platform: 'node',
  bundle: true,
  minify: false,
  sourcemap: true,
  external: ['aws-sdk'],
  outdir: 'dist',
  entryPoints: ['src/app.ts'],
};