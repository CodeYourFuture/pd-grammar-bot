const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless');
const pdf = require('pdf-parse');

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type !== 'Bot') {
            if (context.payload.comment.body.includes('[pd.pdf]')) {
                const match = context.payload.comment.body.match(/\[pd\.pdf\]\(([^)]+)\)/);
                const pdfUrl = match ? match[1] : null;

                console.log(pdfUrl);

                let res = await fetch(pdfUrl);
                const fileBuffer = await res.arrayBuffer();

                
            }
        }
    });
};

module.exports.handler = createLambdaFunction(appFn, {
    probot: createProbot(),
});

function renderPage(pageData) {
    return pageData.getTextContent()
        .then(textContent => {
            let lastY, text = '';
            for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                    text += item.str + ' ';
                }
                else {
                    text += '\n' + item.str + ' ';
                }
                lastY = item.transform[5];
            }
            return text;
        });
}