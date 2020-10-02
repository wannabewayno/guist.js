const { Matrix } = require('ml-matrix');

describe('Transpose js', () => {
    it('Should transpose a 4x2 Matrix into 2x4 Matrix', () => {
        const matrix = new Matrix([
            [1,0],
            [9,2],
            [13,1],
            [2,0],
        ]);
        const transposedMatrix = new Matrix([
            [1,9,13,2],
            [0,2,1,0],
        ]);
        expect(matrix.transpose()).toStrictEqual(transposedMatrix);
    })
})