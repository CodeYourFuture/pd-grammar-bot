const fs = require('fs');
const { setupServer } = require('msw/node');
const { http, HttpResponse } = require('msw');

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
        })
    ]
};

const server = setupServer(...handlers.dummy);

server.listen();

module.exports.server = server;
module.exports.handlers = handlers;