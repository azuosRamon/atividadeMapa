const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..', 'src', 'components', 'menus');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We only care about files that use CriarCamposFormulario
    if (!content.includes('CriarCamposFormulario')) return;
    
    // If it already has setObjeto prop, skip
    if (content.includes('setObjeto={setObjeto}')) return;

    // Replace `objeto={objeto}` or `objeto ={objeto}` with `objeto={objeto} setObjeto={setObjeto}`
    const regex = /objeto\s*=\s*\{objeto\}/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, 'objeto={objeto}\n                    setObjeto={setObjeto}');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.basename(filePath));
    } else {
        console.log('No replacement found for:', path.basename(filePath));
    }
}

fs.readdirSync(directoryPath).forEach(file => {
    if (file.endsWith('.jsx')) {
        processFile(path.join(directoryPath, file));
    }
});
