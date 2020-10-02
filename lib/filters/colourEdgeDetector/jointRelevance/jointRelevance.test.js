const jointRelevance = require('./');

describe('jointRelevance', () => {
    const midpoint = 0.5
    it('should return 0.5 at 127.5 and 127.5', () => {
        const testValue = [127.5,127.5]
        const expectedResult = 0.5
        expect(Math.round(jointRelevance(...testValue, { midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0.014 at 0 and 255', () => {
        const testValue = [0,255]
        const expectedResult = 0.014
        expect(Math.round(jointRelevance(...testValue, { midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0 at 0 and 0', () => {
        const testValue = [0,0]
        const expectedResult = 0
        expect(Math.round(jointRelevance(...testValue, { midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 1 at 255 and 255', () => {
        const testValue = [255,255]
        const expectedResult = 1
        expect(Math.round(jointRelevance(...testValue, { midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0.073 at 75 and 75', () => {
        const testValue = [75,75]
        const expectedResult = 0.073
        expect(Math.round(jointRelevance(...testValue, { midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0.927 at 180 and 180', () => {
        const testValue = [180,180]
        const expectedResult = 0.927
        expect(Math.round(jointRelevance(...testValue, { midpoint })*1000)/1000).toBe(expectedResult)
    })

    it('should return 0.26 at 75 and 180', () => {
        const testValue = [75,180]
        const expectedResult = 0.26
        expect(Math.round(jointRelevance(...testValue, { midpoint })*1000)/1000).toBe(expectedResult)
    })
})