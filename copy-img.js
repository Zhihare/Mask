const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/img');
const destDir = path.join(__dirname, 'dist/img');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});
