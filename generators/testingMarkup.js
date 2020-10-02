const fs = require('fs');
const path = require('path');
const generateTestData = require('./generateTestData');

/**
 * Takes in a folder path and adds necessary files and folders for unit testing
 * @param {String} folderPath 
 */
function testingMarkup (folderPath) {
    const dirToRead = path.resolve(folderPath);
    const filesAndFolders = fs.readdirSync(dirToRead);
    
    // check to see if folder already contains tests.abs
    const extensions = filesAndFolders
    .map(fileOrFolder => path.parse(path.parse(fileOrFolder).base).ext);

    // already has tests return early
    if(extensions.includes('.test')) return;

    // now we need recursively go through each file and folder
    filesAndFolders.forEach(fileOrFolder => {
        const fileOrFolderPath = path.join(folderPath,fileOrFolder);
        const isDirectory = fs.lstatSync(fileOrFolderPath).isDirectory();

        if(isDirectory){ // is a directory
            // we go through all filesAndFolders in this dir
            testingMarkup(fileOrFolderPath);

        } else { // is a file
            // we can only test .js or .jsx files so test this;
            const { name, ext } = path.parse(fileOrFolder);

            // special case
            if ( name === 'index' ) {
                const newName = path.parse(folderPath).name;
                // create data for this file
                const data = generateTestData(newName);

                // create a test for the function in the root <functionName>.test.js
                const testPath = path.join(folderPath, `${newName}.test.js`);
                fs.writeFileSync(testPath, data)
            }

            if(['.js','.jsx'].includes(ext)) {

                const dirName = path.join(folderPath,name);
                fs.mkdirSync(dirName);

                // we move the file into this folder as index.js
                const oldPath = path.join(folderPath, fileOrFolder);
                const newPath = path.join(dirName,'index.js');
                fs.renameSync(oldPath,newPath);

                // we need to create a file like <fileName>.test.js
                const testPath = path.join(dirName, `${name}.test.js`);
                // create data for this file
                const data = generateTestData(name);
                // create the file inside our new directory
                fs.writeFileSync(testPath, data);
            }
        }
    })

}

const [,,folderPath] = process.argv;

testingMarkup(folderPath);

module.exports = testingMarkup;