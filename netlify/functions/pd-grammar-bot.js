const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless');
const pdf = require('pdf-parse');

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type !== 'Bot') {
            if (context.payload.comment.body.includes('[pd.pdf]')) {
                try {
                    const match = context.payload.comment.body.match(/\[pd\.pdf\]\(([^)]+)\)/);
                    const pdfUrl = match ? match[1] : null;
    
                    let res = await fetch(pdfUrl);
                    const fileBuffer = await res.arrayBuffer();
    
                    const pdfData = await pdf(fileBuffer, { pagerender: renderPage });
    
                    const langToolUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8010/v2/check' : process.env.LANG_TOOL_URL;
    
                    res = await fetch(langToolUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: new URLSearchParams({
                            language: 'en-GB',
                            text: pdfData.text
                        })
                    });
    
                    const data = await res.json();
    
                    const commentBody = `Total mistakes: ${data.matches.length}`;
    
                    const params = context.issue({ body: commentBody });
    
                    return context.octokit.issues.createComment(params);
                } catch (error) {
                    console.log(error.message);
                }
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