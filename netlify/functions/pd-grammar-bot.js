const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless');
const { getPdfText } = require('../../src/pdf');
const { checkText } = require('../../src/langTool');

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type !== 'Bot') {
            if (context.payload.comment.body.includes('[pd.pdf]')) {
                try {
                    const pdfText = await getPdfText(context.payload.comment.body);
                    const langToolResult = await checkText(pdfText);
    
                    const commentBody = `Total mistakes: ${langToolResult.matches.length}`;
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