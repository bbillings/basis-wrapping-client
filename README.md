# basis-wrapping-client
a simple npm client for wrapping data using Basis Theory tokenization.
The whole client is based off thier [Quickstart with Node.js](https://developers.basistheory.com/getting-started/quickstart-with-nodejs/) 
guide.

## Set Up

Before running any commands below, it's important to have set up (or have access to)
a Basis Theory Application API Key. This client relies on that API Key having `token:general:create`,
`token:general:read`, and (optionally), `token:general:delete` permissions.

Once you have the API key, make sure to set an environment variable called `BT_WRAP_KEY` in your running environment

```commandline
export BT_WRAP_KEY=[your_key]
```

Then, make sure to install the dependencies with:
```commandline
npm install
```

## Commands
This client mainly consists of 2 commands: `wrap` will tokenize the `data` passed in, and output
the id of the [Token Object](https://docs.basistheory.com/#tokens-token-object) created, while `unwrap` takes a given
`token_id`, and outputs the Token Object's Token data.

### `wrap`

```commandline
npm run wrap --data=thingToTokenize
```

```commandline
token id: 10e9b63f-6a1e-1e3c-12e6-4291c65f1a0a
```

### `unwrap`

take a token id and get data back

```commandline
npm run unwrap --token_id=10e9b63f-6a1e-1e3c-12e6-4291c65f1a0a
```

```commandline
unwrapped data: thingToTokenize
```
**_NOTE_**: `unwrap` should work with any valid token_id, provided it was '`wrapped`' with the same API key