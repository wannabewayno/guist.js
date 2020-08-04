const { createWorker, createScheduler } = require('tesseract.js');

Fn = {};

const buildWorker = async () => {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]. ',
    });
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

//Takes in an array of generated text and compares this to an array of real values
Fn.comparison = (reals,generated) => {

    if(Array.isArray(generated)) generated = generated.join('');

    count = 0;
    const itemsNotFound = [];
    reals.forEach(real => {
        if(generated.indexOf(real)!==-1){
            count++;
        } else {
            itemsNotFound.push(real);
        }
    });
    const comparisonScore = count/reals.length*100;

    return [comparisonScore,itemsNotFound];
}

module.exports = Fn;