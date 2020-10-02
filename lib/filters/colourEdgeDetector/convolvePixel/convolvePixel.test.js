const convolvePixel = require('./');
const { Matrix } = require('ml-matrix');

describe('convolvePixel', () => {
    const testPixels = new Matrix([
        [[100,100,50],[30 ,100,50],[200,25 ,50]],
        [[220, 70,50],[250, 85,50],[160,100,50]],
        [[10 ,100,50],[340,100,50],[350,80 ,50]],
    ])

    it('should convolve the pixel in the x direction with hueComplement mode', () => {
        const options = { mode:'hueComplement', direction:'x' }
        const expectedResult = ''
        expect(convolvePixel(testPixels, options)).toBe(expectedResult)
    })

    it('should convolve the pixel in the y direction with hueComplement mode', () => {
        const options = { mode:'hueComplement', direction:'y' }
        const expectedResult =  ''
        expect(convolvePixel(testPixels, options)).toBe(expectedResult)
    })

    it('should convolve the pixel in the x direction with hueDominant mode', () => {
        const options = { mode:'hueDominant', direction:'x' }
        const expectedResult =  ''
        expect(convolvePixel(testPixels, options)).toBe(expectedResult)
    })

    it('should convolve the pixel in the y direction with hueDominant mode', () => {
        const options = { mode:'hueDominant', direction:'y' }
        const expectedResult =  ''
        expect(convolvePixel(testPixels, options)).toBe(expectedResult)
    })
})