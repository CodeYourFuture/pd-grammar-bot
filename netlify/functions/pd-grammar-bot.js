const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless');
const { getText } = require('../../src/text');
const { checkText } = require('../../src/langTool');
const { createCommentBody } = require('../../src/comment');

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type === 'User') {
            if (/\.docx\b/.test(context.payload.comment.body)) {
                try {
                    const text = await getText(context.payload.comment.body);
                    const langToolResult = await checkText(text);

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