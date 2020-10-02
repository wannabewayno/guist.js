const signedHue = require('./');

describe('signedHue', () => {
    it('should calculate the nominal difference between 200 and 100', () => {
        const testValues = [200,100].map(hue => hue*255/360);
        const expectedResult = Math.round(100*255*1000/360)/1000;
        expect(signedHue(...testValues)).toBe(expectedResult)
    })

    it('should calculate the nominal difference between 0 and 90', () => {
        const testValues = [0,90].map(hue => hue*255/360);
        const expectedResult = Math.round(90*255*1000/360)/1000;
        expect(signedHue(...testValues)).toBe(expectedResult)
    })

    it('should calculate the real difference between 10 and 350', () => {
        const testValues = [10,350].map(hue => hue*255/360);
        const expectedResult = Math.round(20*255*1000/360)/1000;
        expect(signedHue(...testValues)).toBe(expectedResult)
    })

    it('should calculate the real difference between 270 and 20', () => {
        const testValues = [270,20].map(hue => hue*255/360);
        const expectedResult = Math.round(110*255*1000/360)/1000;
        expect(signedHue(...testValues)).toBe(expectedResult)
    })

    it('should calculate the real difference between 0 and 180', () => {
        const testValues = [180,0].map(hue => hue*255/360);
        const expectedResult = Math.round(180*255*1000/360)/1000;
        expect(signedHue(...testValues)).toBe(expectedResult)
    })
})