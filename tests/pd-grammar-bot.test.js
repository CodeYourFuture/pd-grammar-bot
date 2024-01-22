const { privateKey } = require('./sample-data/dummy-private-key.json');
process.env.APP_ID = 1;
process.env.PRIVATE_KEY = privateKey;
process.env.WEBHOOK_SECRET = 'webhookSecret';

const crypto = require('crypto');
const { handler } = require('../netlify/functions/pd-grammar-bot');
const payload = require('../sample-data/github-event.json');

describe('GitHub app', () => {
    it('works', async () => {
        const result = await handler(createGitHubRequest(payload));
    });
});

function createGitHubRequest(data) {
    const body = JSON.stringify(data);
    const hmac = crypto.createHmac('sha256', 'webhookSecret');
    const signature = 'sha256=' + hmac.update(body).digest('hex');

    return {
        httpMethod: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Hub-Signature-256': signature,
            'X-GitHub-Event': 'issue_comment'
        },
        body
    };
};