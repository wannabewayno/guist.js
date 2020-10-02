
module.exports = function(fileName){
    return (
`const ${fileName} = require('./');

describe('${fileName}', () => {
    it('should ...', () => {
        const testValue = '...'
        const expectedResult = '...'
        expect(${fileName}(testValue)).toBe(expectedResult)
    })
})`)

}
