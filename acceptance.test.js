const {wrap, unwrap, wrapAndLog, unwrapAndLog, deleteTokens} = require('./index');
const Chance = require('chance');

const chance = new Chance();

describe('end to end process', () => {
    let data,
        unwrappedData,
        tokenId;

    beforeEach(async () => {
        data = chance.word();

        tokenId = await wrap(data);
        unwrappedData = await unwrap(tokenId);
    });

    test('can wrap, then unwrap', () => {
        expect(unwrappedData).toEqual(data);
    });

    test('can log wrapping', async () => {
        await wrapAndLog(data);
    });

    test('can log unwrapping', async () => {
        await unwrapAndLog(tokenId);
    });

    afterAll(async () => {
        await deleteTokens();
    });
});