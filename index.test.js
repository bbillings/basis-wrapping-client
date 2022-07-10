const {wrap, unwrap} = require('./index');
const axios = require('axios');
const {when} = require('jest-when');
const Chance = require('chance');

const chance = new Chance();
jest.mock('axios');

describe('index', () => {
    const oldEnv = process.env;
    let mockedBTKey;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...oldEnv};
        mockedBTKey = chance.guid();
        process.env.BT_WRAP_KEY = mockedBTKey;
    });

    describe('wrap', () => {
        const env = process.env;

        let givenDataToWrap,
            mockTokenId,
            actualTokenId,
            data,
            config;

        beforeEach(async () => {
            givenDataToWrap = chance.apple_token();
            mockTokenId = chance.guid();

            data = {
                type: 'token',
                data: givenDataToWrap
            };

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'BT-API-KEY': mockedBTKey
                }
            }

            when(axios.post).calledWith('https://api.basistheory.com/tokens', data, config)
                .mockImplementation(() => Promise.resolve({
                    data: {
                        id: mockTokenId
                    }
                }));

            actualTokenId = await wrap(givenDataToWrap);
        });

        test('returns wrapped token id', () => {
            expect(actualTokenId).toEqual(mockTokenId);
        });

        test('uses basis theory token endpoint', () => {
            expect(axios.post).toHaveBeenCalledWith('https://api.basistheory.com/tokens', data, config);
        });

        describe('\'BT_WRAP_KEY\' not set', () => {

            test('wrap gives an error',async () => {
                process.env.BT_WRAP_KEY = '';

                try {
                    await wrap(givenDataToWrap);
                } catch (error) {
                    expect(error.message).toBe('You must set \'BT_WRAP_KEY\' before data can be wrapped');
                }
            });
        });
    });

    describe('unwrap', () => {
        let givenTokenId,
            expectedUnwrappedToken,
            actualUnwrappedToken,
            config;

        beforeEach(async () => {
            givenTokenId = chance.guid();
            expectedUnwrappedToken = chance.word();

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'BT-API-KEY': mockedBTKey
                }
            };

            when(axios.get).calledWith(`https://api.basistheory.com/tokens/${givenTokenId}`, config)
                .mockImplementation(() => Promise.resolve({
                    data: {
                        data: expectedUnwrappedToken
                    }
                }));

            actualUnwrappedToken = await unwrap(givenTokenId);
        });

        test('returns unwrapped data', () => {
            expect(actualUnwrappedToken).toEqual(expectedUnwrappedToken);
        });

        test('uses basis theory token by id endpoint', () => {
            expect(axios.get)
                .toHaveBeenLastCalledWith(`https://api.basistheory.com/tokens/${givenTokenId}`, config);
        });

        describe('\'BT_WRAP_KEY\' not set', () => {

            test('wrap gives an error',async () => {
                process.env.BT_WRAP_KEY = '';

                try {
                    await unwrap(givenTokenId);
                } catch (error) {
                    expect(error.message).toBe('You must set \'BT_WRAP_KEY\' before data can be unwrapped');
                }
            });
        });
    });

    afterEach(() => {
        process.env = oldEnv;
    });
});