const { privateKey } = require('./sample-data/dummy-private-key.json');
process.env.NODE_ENV = 'development';
process.env.APP_ID = 1;
process.env.PRIVATE_KEY = privateKey;
process.env.WEBHOOK_SECRET = 'webhookSecret';

const crypto = require('crypto');
const { server, handlers, requestPayloads } = require('./server');
const { handler } = require('../netlify/functions/pd-grammar-bot');
const payload = require('../sample-data/github-event.json');

beforeEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

describe('GitHub app', () => {
    it('works', async () => {
        server.use(...handlers.checkPDF);
        const result = await handler(createGitHubRequest(payload));

        console.log(requestPayloads);

        expect(result.statusCode).toBe(200);
        expect(requestPayloads.checkPDF.checkText).toContain('My PD Coursework');
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