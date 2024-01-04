// jest.setup.js
const { execSync } = require('child_process');

// Run Sequelize migrations before tests
execSync('npx sequelize-cli db:migrate', { stdio: 'ignore' });
