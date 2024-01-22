const { privateKey } = require('./dummy-private-key.json');

process.env.APP_ID = 1;
process.env.PRIVATE_KEY = privateKey;
process.env.WEBHOOK_SECRET = 'webhookSecret';

const { handler } = require('../netlify/functions/pd-grammar-bot');
const payload = require('../sample-data/github-event.json');

describe('GitHub app', () => {
    it('works', async () => {
        const result = await handler({
            httpMethod: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    });
});