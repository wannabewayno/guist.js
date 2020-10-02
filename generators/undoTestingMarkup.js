const fs = require('fs');
const path = require('path');

function undoTestingMarkup(folderPath) {
    const dirToRead = path.resolve(folderPath);
    const filesAndFolders = fs.readdirSync(dirToRead);

    // now we need recursively go through each file and folder
    filesAndFolders.forEach(fileOrFolder => {
        const fileOrFolderPath = path.join(folderPath,fileOrFolder);
        const isDirectory = fs.lstatSync(fileOrFolderPath).isDirectory();

        if(isDirectory){ // is a directory
            // we go through all filesAndFolders in this dir
            undoTestingMarkup(fileOrFolderPath);

        } else { // is a file
            // we can only test .js or .jsx files so test this;
            const { name, ext } = path.parse(fileOrFolder);

            if(['.js','.jsx'].includes(ext) && name === 'name') {

                // we move the file into this folder as index.js
                const oldPath = path.join(folderPath, fileOrFolder);
                const newPath = path.join(path.parse(folderPath).name,'../', `${name}.js`);
                fs.renameSync(oldPath,newPath);
            }
        }
    })

}

undoTestingMarkup('./lib/filters/colourEdgeDetector')

module.exports = undoTestingMarkup;