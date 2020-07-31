const { HSL2RGB } = require('../lib/filters/channelsRGB');


describe('HSL2RGB(): unit test', () => {
    it('should take in a HSL value and return an RGB value', () => {
        const testValues = [39,34.2,14.9];
        const expected = [51,42,25];
        expect(HSL2RGB(...testValues)).toStrictEqual(expected);
    });
});