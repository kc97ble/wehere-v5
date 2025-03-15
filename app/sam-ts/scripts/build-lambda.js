#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.resolve(__dirname, '../dist');
const buildDir = path.resolve(__dirname, '../.aws-sam/build/ProcessorFunction');

// Ensure build directory exists
fs.mkdirSync(buildDir, { recursive: true });

// Copy TypeScript compiled files
console.log('Copying compiled files...');
fs.readdirSync(distDir).forEach(file => {
  fs.copyFileSync(path.join(distDir, file), path.join(buildDir, file));
});

// Create package.json
console.log('Creating package.json...');
fs.writeFileSync(
  path.join(buildDir, 'package.json'),
  JSON.stringify({
    name: "lambda-function",
    version: "1.0.0",
    private: true,
    dependencies: {
      "node-fetch": "^2.6.7"
    }
  }, null, 2)
);

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { cwd: buildDir, stdio: 'inherit' });

console.log('Lambda build complete!');