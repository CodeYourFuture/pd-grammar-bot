const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless');
const { getPdfText } = require('../../src/pdf');
const { checkText } = require('../../src/langTool');
const { createCommentBody } = require('../../src/comment');

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type === 'User') {
            if (/\.docx\b/.test(context.payload.comment.body)) {
                try {
                    const pdfText = await getPdfText(context.payload.comment.body);
                    const langToolResult = await checkText(pdfText);

                    const commentBody = createCommentBody(langToolResult);
                    const params = context.issue({ body: commentBody });
                    return context.octokit.issues.createComment(params);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    });
};

module.exports.handler = createLambdaFunction(appFn, {
    probot: createProbot(),
});