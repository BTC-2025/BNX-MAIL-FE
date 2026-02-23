const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
let updatedCount = 0;

files.forEach(file => {
    const filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    // Replace left pane class
    content = content.replace(/\$\{selectedEmail \? "hidden lg:block lg:w-[^"]+" : "w-full"\}/g, 'w-full');

    // Replace right pane class
    content = content.replace(/\$\{selectedEmail \? "block" : "hidden lg:block"\}/g, '');

    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        updatedCount++;
        console.log(`Updated layout in ${file}`);
    }
});
console.log(`Done. Updated ${updatedCount} files.`);
