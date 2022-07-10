const axios = require('axios');

const headerConfig = {
    headers: {
        'Content-Type': 'application/json',
        'BT-API-KEY': process.env.BT_WRAP_KEY
    }
};

const wrap = async (dataToWrap) => {
    if (!process.env.BT_WRAP_KEY) {
        throw new Error('You must set \'BT_WRAP_KEY\' before data can be wrapped');
    }

    const data = {type: 'token', data: dataToWrap};

    return await axios.post('https://api.basistheory.com/tokens', data, headerConfig)
        .then(response => response.data.id);
}

const wrapAndLog = async (dataToWrap) => {
    const tokenId = await wrap(dataToWrap);
    console.log(`token id: ${tokenId}`);
}

const unwrap = async (tokenId) => {
    if (!process.env.BT_WRAP_KEY) {
        throw new Error('You must set \'BT_WRAP_KEY\' before data can be unwrapped');
    }

    return await axios.get(`https://api.basistheory.com/tokens/${tokenId}`, headerConfig)
        .then(response => response.data.data);
}

const unwrapAndLog = async (tokenId) => {
    const unwrappedData = await unwrap(tokenId);
    console.log(`unwrapped data: ${unwrappedData}`);
}

module.exports = {wrap, wrapAndLog, unwrap, unwrapAndLog}