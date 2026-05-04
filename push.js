const { execSync } = require('child_process');
const gitPath = '"C:\\Program Files\\Git\\cmd\\git.exe"';
try {
  console.log('Adding files...');
  execSync(`${gitPath} add .`, { stdio: 'inherit' });
  
  console.log('Committing...');
  try {
    execSync(`${gitPath} commit -m "Add Cloudinary fallback"`, { stdio: 'inherit' });
  } catch(e) {
    console.log('Nothing to commit or commit failed.');
  }

  console.log('Pushing...');
  execSync(`${gitPath} push`, { stdio: 'inherit' });
  console.log('Successfully pushed!');
} catch (error) {
  console.error('Error during git push:', error);
}
