const fs = require('fs');
const path = require('path');

const filesToReplace = [
    'implementation_plan.md',
    'frontend/src/services/api.js',
    'frontend/src/context/AuthContext.jsx',
    'frontend/package.json',
    'frontend/package-lock.json',
    'backend/package.json',
    'backend/package-lock.json',
    'docs/especificacion_tecnica_sena_conecta.md',
    'database/seed_mysql.sql',
    'database/schema_mysql.sql',
    'backend/src/data/mockData.js',
    'backend/src/controllers/competenciaController.js',
    'backend/src/controllers/adminController.js',
    'backend/src/config/init_sqlite.js'
];

const basePath = 'c:/Users/USUARIO/Downloads/ArticulApp-20260915T211517Z-1-001/ArticulApp';

filesToReplace.forEach(relPath => {
    const fullPath = path.join(basePath, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        content = content.replace(/SENA Conecta/gi, 'Instituto Estudiantil');
        content = content.replace(/senaconecta/gi, 'institutoestudiantil');
        content = content.replace(/misena/gi, 'instituto');
        content = content.replace(/\bSENA\b/g, 'Instituto');
        content = content.replace(/sena-conecta/gi, 'instituto-estudiantil');
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Modificado:', relPath);
    }
});
