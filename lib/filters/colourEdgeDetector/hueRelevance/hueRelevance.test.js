const hueRelevance = require('./');

describe('hueRelevance takes in a saturation value and returns a value from [0,1] of how relevant the hue is for colour edge detection', () => {
    it('should return 0.5 when at the midpoint', () => {
        const testValue = 127.5;
        const expectedResult = 0.5;
        const midpoint = 0.5;
        expect(hueRelevance(testValue,{ midpoint })).toBe(expectedResult)
    })

    it('should return 1 at the maximum', () => {
        const testValue = 255;
        const expectedResult = 1;
        const midpoint = 0.5;
        expect(Math.round(hueRelevance(testValue,{ midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0 at the minimum', () => {
        const testValue = 0;
        const expectedResult = 0;
        const midpoint = 0.5;
        expect(Math.round(hueRelevance(testValue,{ midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0.927 at 180', () => {
        const testValue = 180;
        const expectedResult = 0.927;
        const midpoint = 0.5;
        expect(Math.round(hueRelevance(testValue,{ midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0.0727 at 75', () => {
        const testValue = 75;
        const expectedResult = 0.073;
        const midpoint = 0.5;
        expect(Math.round(hueRelevance(testValue,{ midpoint })*1000)/1000).toBe(expectedResult)
    })
})