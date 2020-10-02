const SobelConvolution = require('./');
const { Matrix } = require('ml-matrix');

describe('SobelConvolution: prepares a matrix for convolution in the x and y direction by selecting values from the matrix', () => {

    const testPixels = new Matrix([
        [ [100,100,50],[30 ,100,50],[200,25 ,50] ],
        [ [220, 70,50],[250, 85,50],[160,100,50] ],
        [ [10 ,100,50],[340,100,50],[350,80 ,50] ],
    ])

    it('Should return an array of x-dependent values', () => {
        const expectedResult = [
            [1, [100,100,50], [200,25 ,50] ],
            [2, [220,70 ,50], [160,100,50] ],
            [1, [10 ,100,50], [350,80 ,50] ],
        ]
        expect(SobelConvolution(testPixels,'x')).toStrictEqual(expectedResult)
    })

    it('Should return an array of y-dependent values', () => {
        const expectedResult = [
            [1, [100,100,50], [10 ,100,50] ],
            [2, [30 ,100,50], [340,100,50] ],
            [1, [200, 25,50], [350,80 ,50] ],
        ]
        expect(SobelConvolution(testPixels,'y')).toStrictEqual(expectedResult)
    })
})