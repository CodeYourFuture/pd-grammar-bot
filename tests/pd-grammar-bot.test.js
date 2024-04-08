const { privateKey } = require('./sample-data/dummy-private-key.json');
process.env.NODE_ENV = 'development';
process.env.APP_ID = 1;
process.env.PRIVATE_KEY = privateKey;
process.env.WEBHOOK_SECRET = 'webhookSecret';

const crypto = require('crypto');
const { server, handlers, requestPayloads } = require('./server');
const { handler } = require('../netlify/functions/pd-grammar-bot');
const payload = require('../sample-data/github-event.json');
const { createCommentBody } = require('../src/comment');

beforeEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

describe('GitHub app', () => {
    it('checks text for mistakes', async () => {
        server.use(...handlers.checkText);
        const result = await handler(createGitHubRequest(payload));

        expect(result.statusCode).toBe(200);
        expect(requestPayloads.checkText.checkText.text).toContain('My PD Coursework');
        expect(requestPayloads.checkText.createComment.body).toContain('Total Possible Mistakes: 2');
    });
});

describe('createCommentBody function', () => {
    it('should generate correct comment body for no mistakes', () => {
        const langToolResult = {
            matches: []
        };
        expect(createCommentBody(langToolResult)).toEqual('### 👍 Total Possible Mistakes: 0');
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