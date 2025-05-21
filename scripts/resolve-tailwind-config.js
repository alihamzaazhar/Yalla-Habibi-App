const resolveConfig = require('tailwindcss/resolveConfig')
const tailwindConfig = require('../tailwind.config')
const config = resolveConfig(tailwindConfig)
const path = require('path')
const fs = require('fs');
const data = `module.exports = ${JSON.stringify(config.theme.colors)}`;
const constantsFolderPath = path.join(process.cwd(), 'constants');
const tailwindConfigFilePath = path.join(constantsFolderPath, 'tailwindCoreColors.js');
fs.writeFile(tailwindConfigFilePath, data, (err) => {
  if (err) {
    
  } else {
    
  }
});