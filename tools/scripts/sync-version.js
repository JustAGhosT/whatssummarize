const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const envPath = path.join(__dirname, '..', '.env.local');

let env = '';
if (fs.existsSync(envPath)) {
  env = fs.readFileSync(envPath, 'utf8');
  // Remove any existing NEXT_PUBLIC_APP_VERSION line
  env = env.replace(/^NEXT_PUBLIC_APP_VERSION=.*$/m, '');
  env = env.trim();
}

const versionLine = `NEXT_PUBLIC_APP_VERSION=${pkg.version}`;
env = env ? `${env}\n${versionLine}\n` : `${versionLine}\n`;

fs.writeFileSync(envPath, env, 'utf8');
console.log(`Synced version ${pkg.version} to .env.local`); 