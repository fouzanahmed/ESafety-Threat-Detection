#!/usr/bin/env node

/**
 * ESafety Threat Detection - Setup Verification Script
 *
 * This script verifies that all components are properly installed and configured.
 * Run this before starting the application to catch any issues early.
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 ESafety Threat Detection - Setup Verification\n');
console.log('='.repeat(60));

let errors = [];
let warnings = [];
let passed = 0;

// Helper functions
function check(name, condition, errorMsg = '', warnMsg = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
    return true;
  } else if (warnMsg) {
    console.log(`⚠️  ${name}`);
    warnings.push(warnMsg);
    return false;
  } else {
    console.log(`❌ ${name}`);
    errors.push(errorMsg || `Failed: ${name}`);
    return false;
  }
}

function fileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch (e) {
    return false;
  }
}

// 1. Check Node.js version
console.log('\n📦 Environment Checks:');
const nodeVersion = process.version.match(/^v(\d+)\./)[1];
check(
  'Node.js version 18+',
  parseInt(nodeVersion) >= 18,
  `Node.js ${nodeVersion} found. Requires version 18+. Please upgrade.`
);

// 2. Check critical files
console.log('\n📁 File Structure Checks:');
const criticalFiles = [
  'server/index.js',
  'server/services/aiService.js',
  'server/services/deepfakeDetectionService.js',
  'server/services/groomingDetectionService.js',
  'server/services/cyberbullyingDetectionService.js',
  'server/services/videoDownloadService.js',
  'server/controllers/analysisController.js',
  'server/routes/analysis.js',
  'package.json'
];

criticalFiles.forEach(file => {
  check(`File exists: ${file}`, fileExists(file), `Missing critical file: ${file}`);
});

// 3. Check environment configuration
console.log('\n⚙️  Configuration Checks:');
const envExists = fileExists('.env');
check('.env file exists', envExists, 'Create .env file from .env.example');

if (envExists) {
  const envContent = fs.readFileSync('.env', 'utf8');
  check(
    'GOOGLE_AI_API_KEY configured',
    envContent.includes('GOOGLE_AI_API_KEY=') && !envContent.includes('GOOGLE_AI_API_KEY=your_'),
    '',
    'GOOGLE_AI_API_KEY not set. AI features will be limited.'
  );
}

// 4. Check dependencies
console.log('\n📚 Dependency Checks:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'express',
    '@google/generative-ai',
    'multer',
    'sharp',
    'axios',
    '@distube/ytdl-core',
    'youtube-transcript',
    'fs-extra'
  ];

  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  requiredDeps.forEach(dep => {
    check(`Dependency: ${dep}`, dependencies[dep], `Missing dependency: ${dep}. Run: npm install`);
  });
} catch (e) {
  errors.push('Could not read package.json');
  console.log('❌ Could not read package.json');
}

// 5. Check service files
console.log('\n🔧 Service Checks:');
const services = [
  'server/services/aiService.js',
  'server/services/imageService.js',
  'server/services/nlpService.js',
  'server/services/urlService.js',
  'server/services/videoDownloadService.js',
  'server/services/deepfakeDetectionService.js',
  'server/services/groomingDetectionService.js',
  'server/services/cyberbullyingDetectionService.js'
];

services.forEach(service => {
  if (fileExists(service)) {
    try {
      const content = fs.readFileSync(service, 'utf8');
      const serviceName = path.basename(service, '.js');
      check(
        `Service valid: ${serviceName}`,
        content.includes('module.exports') || content.includes('export'),
        `Service file exists but may have issues: ${service}`
      );
    } catch (e) {
      errors.push(`Could not read service: ${service}`);
      console.log(`❌ Service error: ${service}`);
    }
  }
});

// 6. Check routes and controllers
console.log('\n🛣️  Route & Controller Checks:');
if (fileExists('server/routes/analysis.js')) {
  const routeContent = fs.readFileSync('server/routes/analysis.js', 'utf8');
  const endpoints = [
    '/text',
    '/image',
    '/images',
    '/url',
    '/deepfake',
    '/grooming',
    '/cyberbullying',
    '/conversation'
  ];

  endpoints.forEach(endpoint => {
    check(
      `Route configured: ${endpoint}`,
      routeContent.includes(`'${endpoint}'`),
      `Route missing: ${endpoint}`
    );
  });
}

if (fileExists('server/controllers/analysisController.js')) {
  const controllerContent = fs.readFileSync('server/controllers/analysisController.js', 'utf8');
  const methods = [
    'analyzeText',
    'analyzeImage',
    'analyzeImages',
    'analyzeUrl',
    'analyzeDeepfake',
    'analyzeGrooming',
    'analyzeCyberbullying',
    'analyzeConversation'
  ];

  methods.forEach(method => {
    check(
      `Controller method: ${method}`,
      controllerContent.includes(`async ${method}(`),
      `Controller method missing: ${method}`
    );
  });
}

// 7. Check optional tools
console.log('\n🔌 Optional Tools (Enhanced Mode):');
const { execSync } = require('child_process');

function checkCommand(cmd, name) {
  try {
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

const hasInstaloader = checkCommand('instaloader --version', 'instaloader') ||
                      checkCommand('python -m instaloader --version', 'python -m instaloader');
check(
  'instaloader (Instagram support)',
  hasInstaloader,
  '',
  'Install with: pip install instaloader (optional for enhanced Instagram support)'
);

const hasYtDlp = checkCommand('yt-dlp --version', 'yt-dlp') ||
                checkCommand('python -m yt_dlp --version', 'python -m yt_dlp');
check(
  'yt-dlp (TikTok support)',
  hasYtDlp,
  '',
  'Install with: pip install yt-dlp (optional for enhanced TikTok support)'
);

// 8. Check directories
console.log('\n📂 Directory Checks:');
const directories = ['logs', 'temp'];
directories.forEach(dir => {
  if (!fileExists(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
    passed++;
  } else {
    check(`Directory exists: ${dir}`, true);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Verification Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ⚠️  Warnings: ${warnings.length}`);
console.log(`   ❌ Errors: ${errors.length}`);

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(`   • ${w}`));
}

if (errors.length > 0) {
  console.log('\n❌ Errors (must fix):');
  errors.forEach(e => console.log(`   • ${e}`));
  console.log('\n🔧 Fix these issues and run again: node verify-setup.js\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n✅ Setup is valid! Warnings are for optional features.');
  console.log('\n🚀 You can start the app with: npm run dev\n');
  process.exit(0);
} else {
  console.log('\n✅ Perfect! Everything is configured correctly.');
  console.log('\n🚀 Start the application with: npm run dev\n');
  process.exit(0);
}
