const path = require('path');
const libPath = path.join(__dirname,'../','lib');
const Fn = require(path.join(libPath,'imageProcessing.js'));
const testParameters = require('./testParameters.js');

describe('createProgressHash(): unit test', () => {
    it('should take in a filters object and return a progress Hash object',()=>{
        //get our test parameters from the parameters file.
        const { createProgressHash:{ testValues, expected }} = testParameters;
        //test it
        expect(Fn.createProgressHash(...testValues)).toStrictEqual(expected);
    });
});


describe('updateProgress(): unit test', () => {
    it('should take in the progress hash, modify it and return it with new values',() => {
        //get our test parameters from the parameters file.
        const { updateProgress:{ testValues, expected }} = testParameters;
        //test it
        expect(Fn.updateProgress(...testValues)).toStrictEqual(expected);
    });
});

describe('getFilterSequence(): unit test', () => {
    it('should take in the progress hash, and return an array of filter names in the order to apply',() => {
        //get our test parameters from the parameters file.
        const { getFilterSequence:{ testValues, expected }} = testParameters;
        //test it
        expect(Fn.getFilterSequence(...testValues)).toStrictEqual(expected);
    });
});