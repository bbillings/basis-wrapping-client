const {wrap, unwrap, deleteTokens} = require('./index');
const axios = require('axios');
const {when} = require('jest-when');
const Chance = require('chance');

const chance = new Chance();
jest.mock('axios');

describe('index', () => {
    const oldEnv = process.env;
    const mockedBTKey = chance.guid();
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'BT-API-KEY': mockedBTKey
        }
    };

    beforeEach(() => {
        jest.resetModules();
        process.env = {...oldEnv};
        process.env.BT_WRAP_KEY = mockedBTKey;
    });

    describe('wrap', () => {
        let givenDataToWrap,
            mockTokenId,
            actualTokenId,
            data;

        beforeEach(async () => {
            givenDataToWrap = chance.apple_token();
            mockTokenId = chance.guid();

            data = {
                type: 'token',
                data: givenDataToWrap
            };

            when(axios.post).calledWith('https://api.basistheory.com/tokens', data, axiosConfig)
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
            expect(axios.post).toHaveBeenCalledWith('https://api.basistheory.com/tokens', data, axiosConfig);
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
            actualUnwrappedToken;

        beforeEach(async () => {
            givenTokenId = chance.guid();
            expectedUnwrappedToken = chance.word();

            when(axios.get).calledWith(`https://api.basistheory.com/tokens/${givenTokenId}`, axiosConfig)
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
                .toHaveBeenLastCalledWith(`https://api.basistheory.com/tokens/${givenTokenId}`, axiosConfig);
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

    describe('delete tokens', () => {

        describe('tokens to delete specified', () => {
            let tokensToDelete;

            beforeEach(async () => {
                tokensToDelete = chance.n(() => chance.guid(), chance.integer({min: 1, max: 10}));

                when(axios.delete).mockImplementation(() => Promise.resolve({headers: {'BT-TRACE-ID': chance.guid()}}));

                await deleteTokens(tokensToDelete);
            });

            test('uses delete token endpoint for each token', () => {
                expect(axios.delete).toBeCalledTimes(tokensToDelete.length);
            });

            test('uses delete token endpoint with correct parameters', () => {
                tokensToDelete.map(token => {
                    expect(axios.delete).toHaveBeenCalledWith(`https://api.basistheory.com/tokens/${token.id}`, axiosConfig);
                });
            });
        });

        describe('tokens to delete NOT specified', () => {
            let existingTokens;

            beforeEach(async () => {
                existingTokens = chance.n(() => ({id: chance.guid()}), chance.integer({min: 1, max: 10}));

                const tokenListBody = { data: existingTokens };

                when(axios.get).mockImplementation(() => Promise.resolve({data: tokenListBody}));

                await deleteTokens();
            });

            test('finds all existing tokens', () => {
                expect(axios.get).toHaveBeenLastCalledWith(`https://api.basistheory.com/tokens`, axiosConfig);
            });

            test('uses delete token endpoint for each existing token', () => {
                existingTokens.map(token => {
                    expect(axios.delete).toHaveBeenCalledWith(`https://api.basistheory.com/tokens/${token.id}`, axiosConfig);
                });
            });
        });
    })

    afterEach(() => {
        process.env = oldEnv;
    });
});