const { createWorker, createScheduler } = require('tesseract.js');

Fn = {};

const buildWorker = async () => {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    return new Promise((resolve,reject) => {
        resolve(worker);
        reject(new Error('error building worker'));
    });
}

const buildWorkers = async numberOfWorkers => {
    console.log(`Building workers: Standby`);
    const workers = [];
    for (let i = 0; i < numberOfWorkers; i++) {
        const worker = await buildWorker();
        workers.push(worker);
    }
    console.log(`Building workers: Complete!`);
    return workers;
}

Fn.buildScheduler = async numberOfWorkers => {
    const scheduler = createScheduler();
    const workers = await buildWorkers(numberOfWorkers);
    workers.forEach(worker => {
        scheduler.addWorker(worker);
    });
    return scheduler;
}

//TODO overhaul this for our new method
//Takes in an array of text and compares 
Fn.comparison = (Real,Generated) => {
    const resultString = Generated;
    count = 0;
    Real.forEach(real => {
        if(resultString.indexOf(real)!==-1){
            count++;
        }
    });
    comparisonScore = count/Real.length*100;
    return comparisonScore;
}

module.exports = Fn;