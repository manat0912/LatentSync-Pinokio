const fs = require('fs');
const path = require('path');
const os = require('os');

const homeDir = os.homedir();
const targetDir = path.join(homeDir, '.cache', 'torch', 'hub', 'checkpoints');
console.log(`[DEBUG] Home directory: ${homeDir}`);
console.log(`[DEBUG] Target directory (cache): ${targetDir}`);

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  console.log(`[DEBUG] Target directory does not exist. Creating: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`[DEBUG] Target directory created: ${fs.existsSync(targetDir)}`);
} else {
  console.log(`[DEBUG] Target directory already exists: ${targetDir}`);
}

const sourceDir = path.resolve('app', 'checkpoints', 'auxiliary');
console.log(`[DEBUG] Source directory (auxiliary checkpoints): ${sourceDir}`);
if (!fs.existsSync(sourceDir)) {
  console.error(`[ERROR] Source directory does not exist: ${sourceDir}`);
  process.exit(1); // Exit if source directory is missing
}

const filesToLink = [
  '2DFAN4-cd938726ad.zip',
  's3fd-619a316812.pth',
  'vgg16-397923af.pth'
];

filesToLink.forEach(file => {
  const sourceFile = path.join(sourceDir, file);
  const targetFile = path.join(targetDir, file);
  console.log(`[DEBUG] Processing file: ${file}`);
  console.log(`[DEBUG]   Source file path: ${sourceFile}`);
  console.log(`[DEBUG]   Target file path: ${targetFile}`);

  if (!fs.existsSync(targetFile)) {
    if (fs.existsSync(sourceFile)) {
      try {
        console.log(`[DEBUG] Attempting to create symlink for ${file}`);
        fs.symlinkSync(sourceFile, targetFile, 'file');
        console.log(`Successfully created symlink for ${file} from ${sourceFile} to ${targetFile}`);
      } catch (error) {
        if (os.platform() === 'win32' && error.code === 'EPERM') {
          console.warn(`Symlink creation failed for ${file} due to permissions. Falling back to copying the file.`);
          try {
            console.log(`[DEBUG] Attempting to copy ${file} from ${sourceFile} to ${targetFile}`);
            fs.copyFileSync(sourceFile, targetFile);
            console.log(`Successfully copied ${file} from ${sourceFile} to ${targetFile}`);
          } catch (copyError) {
            console.error(`Failed to copy ${file} from ${sourceFile} to ${targetFile}:`, copyError);
          }
        } else {
          console.error(`Failed to create symlink for ${file} from ${sourceFile} to ${targetFile}:`, error);
        }
      }
    } else {
      console.warn(`Source file not found for ${file} at ${sourceFile}, cannot create link.`);
    }
  } else {
    console.log(`Link/Copy for ${file} already exists at ${targetFile}.`);
  }
});
