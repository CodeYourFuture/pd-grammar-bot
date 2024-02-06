const fs = require('fs');
const { setupServer } = require('msw/node');
const { http, HttpResponse } = require('msw');
const langToolResponse = require('./sample-data/langtool-response.json');

const requestPayloads = {
    checkPDF: {
        checkText: {},
        createComment: {}
    }
};

const handlers = {
    dummy: [
        http.post('https://google.com', ({ request }) => {
            return HttpResponse.json({ ok: 'true' });
        })
    ],
    checkPDF: [
        http.get('https://github.com/haroon-ali-dev/github-app-testing/files/14011890/pd.pdf', ({ request }) => {
            const pdfBuffer = fs.readFileSync('tests/sample-data/pd.pdf');

            return new HttpResponse(pdfBuffer, { status: 200 });
        }),
        http.post('http://localhost:8010/v2/check', async ({ request }) => {
            requestPayloads.checkPDF.checkText = await getPayload(request);

            return HttpResponse.json(langToolResponse);
        }),
        http.post('https://api.github.com/app/installations/46278106/access_tokens', async ({ request }) => {
            return HttpResponse.json({ ok: 'true' });
        }),
        http.post('https://api.github.com/repos/haroon-ali-dev/github-app-testing/issues/1/comments', async ({ request }) => {
            requestPayloads.checkPDF.createComment = await request.json();

            return HttpResponse.json({ ok: 'true' });
        })
    ]
};

const server = setupServer(...handlers.dummy);

server.listen();

async function getPayload(request) {
    const entries = new URLSearchParams(await request.text()).entries();
    const payload = Object.fromEntries(entries);
    return payload;
}

module.exports.server = server;
module.exports.handlers = handlers;
module.exports.requestPayloads = requestPayloads;