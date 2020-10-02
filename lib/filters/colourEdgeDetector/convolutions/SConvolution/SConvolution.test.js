const SConvolution = require('./');

describe('SConvolution', () => {
    // expecting an options object, a blank object will let us use the defaults;
    const options = {}; 
    it('should calculate SConvolution in the x direction for mode: hueComplement', () => { //!FAIL recieved 89.25
        const testValue = [
            [1, [70.83 , 255.0, 127.5], [141.66, 63.75, 127.5] ],
            [2, [155.83, 178.5, 127.5], [113.33, 255.0, 127.5] ],
            [1, [7.0830, 255.0, 127.5], [247.91, 204.0, 127.5] ],
        ]
        const expectedResult = 89.25;
        expect(Math.round(SConvolution(testValue, 'hueComplement' ,options)*1000)/1000).toBe(expectedResult)
    })
 
    it('should calculate SConvolution in the x direction for mode: hueDominant', () => { //!FAIL recieved 147.988
        const testValue = [
            [1, [70.83 , 255.0, 127.5], [141.66, 63.75, 127.5] ],
            [2, [155.83, 178.5, 127.5], [113.33, 255.0, 127.5] ],
            [1, [7.0830, 255.0, 127.5], [247.91, 204.0, 127.5] ],
        ]
        const expectedResult = 58.73;
        expect(Math.round(SConvolution(testValue, 'hueDominant' ,options)*1000)/1000).toBe(expectedResult)
    })
 
    it('should calculate SConvolution in the y direction for mode: hueComplement', () => {
        const testValue = [
            [1, [70.830, 255.0, 127.5], [7.0800, 255, 127.5] ],
            [2, [21.250, 255.0, 127.5], [240.83, 255, 127.5] ],
            [1, [141.66, 63.75, 127.5], [247.91, 204, 127.5] ],
        ]
        const expectedResult = 140.25;
        expect(Math.round(SConvolution(testValue, 'hueComplement' ,options)*1000)/1000).toBe(expectedResult)
    })

    it('should calculate SConvolution in the y direction for mode: hueDominant', () => { //!FAIL recieved 112.947
        const testValue = [
            [1, [70.830, 255.0, 127.5], [7.0800, 255, 127.5] ],
            [2, [21.250, 255.0, 127.5], [240.83, 255, 127.5] ],
            [1, [141.66, 63.75, 127.5], [247.91, 204, 127.5] ],
        ]
        const expectedResult = 27.3025;
        expect(Math.round(SConvolution(testValue, 'hueDominant' ,options)*1000)/1000).toBe(expectedResult)
    })
})