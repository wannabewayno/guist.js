const createROI = require('./');
const { Matrix } = require('ml-matrix');

describe('createROI', () => {
    const testPixels = [
        [1,2,3,4,5,6],
        [7,8,9,1,2,3],
        [4,5,6,7,8,9],
        [1,2,3,4,5,6],
        [7,8,9,1,2,3],
        [4,5,6,7,8,9],
    ]

    it('should take in a Matrix of pixels and return 3x3 matrix centered around a specified (i,j) coord', () => {
        const i = 1
        const j = 2
        const expectedResult = new Matrix([
            [2,3,4],
            [8,9,1],
            [5,6,7],
        ])

        expect(createROI( testPixels, i, j, 3, 3)).toStrictEqual(expectedResult)
    })
    it('should mirror edges on boundaries', () => {
        const i = 0
        const j = 0
        const expectedResult = new Matrix([
            [1,1,2],
            [1,1,2],
            [7,7,8],
        ])

        expect(createROI( testPixels, i, j, 3, 3)).toStrictEqual(expectedResult)
    })
})