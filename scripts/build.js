// scripts/build.js
require('dotenv').config();
const { execSync } = require('child_process');

execSync('react-scripts build', { stdio: 'inherit' });
