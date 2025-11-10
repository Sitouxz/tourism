/**
 * Clean all cache and build artifacts to free up storage space
 * Run with: node scripts/clean-cache.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');

console.log('🧹 Starting cache cleanup...\n');

// Directories and files to clean
const pathsToClean = [
  // Expo cache
  path.join(rootDir, '.expo'),
  path.join(rootDir, 'node_modules/.cache'),
  
  // Metro bundler cache
  path.join(rootDir, '.metro'),
  path.join(rootDir, 'metro-cache'),
  
  // Android build artifacts
  path.join(rootDir, 'android/build'),
  path.join(rootDir, 'android/app/build'),
  path.join(rootDir, 'android/.gradle'),
  
  // iOS build artifacts (if exists)
  path.join(rootDir, 'ios/build'),
  path.join(rootDir, 'ios/Pods'),
  path.join(rootDir, 'ios/.xcode.env.local'),
  
  // Temp files
  path.join(rootDir, '.tmp'),
  path.join(rootDir, 'tmp'),
  
  // Watchman (if exists)
  path.join(rootDir, '.watchman'),
];

function deleteDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      console.log(`  🗑️  Deleting: ${path.relative(rootDir, dirPath)}`);
      fs.rmSync(dirPath, { recursive: true, force: true });
      return true;
    } catch (error) {
      console.error(`  ❌ Error deleting ${dirPath}:`, error.message);
      return false;
    }
  }
  return false;
}

// Clean directories
let deletedCount = 0;
pathsToClean.forEach(dir => {
  if (deleteDir(dir)) {
    deletedCount++;
  }
});

// Clean npm cache
console.log('\n📦 Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('  ✓ npm cache cleaned');
} catch (error) {
  console.error('  ❌ Error cleaning npm cache:', error.message);
}

// Clean Expo cache
console.log('\n📱 Cleaning Expo cache...');
try {
  execSync('npx expo install --fix', { stdio: 'ignore' });
  console.log('  ✓ Expo cache cleaned');
} catch (error) {
  // Ignore errors for expo install
}

// Try to clean watchman cache
console.log('\n👀 Checking Watchman...');
try {
  execSync('watchman watch-del-all', { stdio: 'ignore' });
  console.log('  ✓ Watchman cache cleaned');
} catch (error) {
  // Watchman might not be installed, that's okay
  console.log('  ⊘ Watchman not found or not needed');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('✨ Cleanup Summary');
console.log('='.repeat(60));
console.log(`  Deleted ${deletedCount} directories/files`);
console.log('  npm cache: cleaned');
console.log('  Expo cache: cleaned');
console.log('\n💡 Tip: You can also run:');
console.log('   - npm run clean (if you add it to package.json)');
console.log('   - rm -rf node_modules && npm install (to reinstall dependencies)');
console.log('   - npx expo start --clear (to start with cleared cache)');
console.log('\n✅ Cleanup completed!\n');



