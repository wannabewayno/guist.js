const LConvolution = require('./');

describe('LConvolution', () => {
    // expecting an options object, a blank object will let us use the defaults;
    const options = {}; 
    it('should calculate LConvolution in the x direction for mode: hueComplement', () => {
        const testValue = [
            [1, [70.83 , 255.0, 127.5], [141.66, 63.75, 127.5] ],
            [2, [155.83, 178.5, 127.5], [113.33, 255.0, 127.5] ],
            [1, [7.0830, 255.0, 127.5], [247.91, 204.0, 127.5] ],
        ]
        const expectedResult = 0;
        expect(Math.round(LConvolution(testValue, 'hueComplement' ,options)*1000)/1000).toBe(expectedResult)
    })
 
    it('should calculate LConvolution in the x direction for mode: hueDominant', () => {
        const testValue = [
            [1, [70.83 , 255.0, 127.5], [141.66, 63.75, 127.5] ],
            [2, [155.83, 178.5, 127.5], [113.33, 255.0, 127.5] ],
            [1, [7.0830, 255.0, 127.5], [247.91, 204.0, 127.5] ],
        ]
        const expectedResult = 0;
        expect(Math.round(LConvolution(testValue, 'hueDominant' ,options)*1000)/1000).toBe(expectedResult)
    })
 
    it('should calculate LConvolution in the y direction for mode: hueComplement', () => {
        const testValue = [
            [1, [70.830, 255.0, 127.5], [7.0800, 255, 127.5] ],
            [2, [21.250, 255.0, 127.5], [240.83, 255, 127.5] ],
            [1, [141.66, 63.75, 127.5], [247.91, 204, 127.5] ],
        ]
        const expectedResult = 0;
        expect(Math.round(LConvolution(testValue, 'hueComplement' ,options)*1000)/1000).toBe(expectedResult)
    })

    it('should calculate LConvolution in the y direction for mode: hueDominant', () => {
        const testValue = [
            [1, [70.830, 255.0, 127.5], [7.0800, 255, 127.5] ],
            [2, [21.250, 255.0, 127.5], [240.83, 255, 127.5] ],
            [1, [141.66, 63.75, 127.5], [247.91, 204, 127.5] ],
        ]
        const expectedResult = 0;
        expect(Math.round(LConvolution(testValue, 'hueDominant' ,options)*1000)/1000).toBe(expectedResult)
    })
})