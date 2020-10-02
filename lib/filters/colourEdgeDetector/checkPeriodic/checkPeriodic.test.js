const checkPeriodic = require('./');

describe('checkPeriodic', () => {
    const min = 0
    const max = 1000

    it('should return original value if not near an edge', () => {
        const testValue = 1
        const expectedResult = 1
        expect(checkPeriodic(testValue, min, max)).toBe(expectedResult)
    })

    it('should return original value if on an edge', () => {
        const testValue = 0
        const expectedResult = 0
        expect(checkPeriodic(testValue, min, max)).toBe(expectedResult)
    })

    it('should return original value if on an edge', () => {
        const testValue = 1000
        const expectedResult = 1000
        expect(checkPeriodic(testValue, min, max)).toBe(expectedResult)
    })

    it('should return mirrored result on negative edges', () => {
        const testValue = -1
        const expectedResult = 0
        expect(checkPeriodic(testValue, min, max)).toBe(expectedResult)
    })

    it('should return mirrored result on postive edges', () => {
        const testValue = 1001
        const expectedResult = 1000
        expect(checkPeriodic(testValue, min, max)).toBe(expectedResult)
    })
})