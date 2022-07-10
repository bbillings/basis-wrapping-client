const axios = require('axios');

const wrap = async (dataToWrap) => {
    if(!process.env.BT_WRAP_KEY) {
        throw new Error('You must set \'BT_WRAP_KEY\' before data can be wrapped');
    }

    return await axios.post('https://api.basistheory.com/tokens',
        {
            type: 'token',
            data: dataToWrap
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'BT-API-KEY': process.env.BT_WRAP_KEY
            }
        })
        .then(response => {
            return response.data.id;
        });
}

const wrapAndLog = async (dataToWrap) => {
    const tokenId = await wrap(dataToWrap);
    console.log(`token id: ${tokenId}`);
}

const unwrap = async (tokenId) => {

    return axios.get(`https://api.basistheory.com/tokens/${tokenId}`, {
        headers: {

        }
    });
}

async function makeMyFirstToken() {

    //Create first Token
    const token = await axios.post('https://api.basistheory.com/tokens',
        {
            type: 'token',
            data: 'foo',
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'BT-API-KEY': 'key_HsdCyJUUMBvLEmFaWtPfSz'
            }
        })

    //Print Token response
    console.log(token.data);

    const readToken = await axios.get(`https://api.basistheory.com/tokens/${token.data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'BT-API-KEY': '[key here]'
            }
        });

    //Print token we read
    console.log("Read your Token:", readToken.data);
    console.log("Read your raw value from the Token:", readToken.data.data);
}

module.exports = {wrap, wrapAndLog, unwrap}