const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless');
const { getPdfText } = require('../../src/pdf');

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type !== 'Bot') {
            if (context.payload.comment.body.includes('[pd.pdf]')) {
                try {
                    const pdfText = await getPdfText(context.payload.comment.body);
    
                    const langToolUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8010/v2/check' : process.env.LANG_TOOL_URL;
    
                    res = await fetch(langToolUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: new URLSearchParams({
                            language: 'en-GB',
                            text: pdfText
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