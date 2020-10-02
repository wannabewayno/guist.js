const HConvolution = require('./');

describe('HConvolution calculates the difference in hue for a convolution', () => {
    // expecting an options object, a blank object will let us use the defaults;
    const options = {}; 
    it('should calculate HConvolution in the x direction', () => {
        const testValue = [
            [1, [100*255/360,255,127.5], [200*255/360,63.75 ,127.5] ],
            [2, [220*255/360,178.5 ,127.5], [160*255/360,255,127.5] ],
            [1, [10*255/360 ,255,127.5], [350*255/360,204 ,127.5] ],
        ]
        const expectedResult = 109.532;
        expect(Math.round(HConvolution(testValue, options)*1000)/1000).toBe(expectedResult)
    })

    it('should calculate HConvolution in the y direction', () => {
        const testValue = [
            [1, [100*255/360,255,127.5], [10*255/360 ,255,127.5] ],
            [2, [30*255/360 ,255,127.5], [340*255/360,255,127.5] ],
            [1, [200*255/360, 63.75,127.5], [350*255/360,204 ,127.5] ],
        ]
        const expectedResult = 155.24;
        expect(Math.round(HConvolution(testValue, options)*1000)/1000).toBe(expectedResult)
    })
})