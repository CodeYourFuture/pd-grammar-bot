import { createLambdaFunction, createProbot } from '@probot/adapter-aws-lambda-serverless';

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type !== 'Bot') {
            if (context.payload.comment.body.includes('[pd.pdf]')) {
                console.log('There is a PDF.');
            }
        }
    });
};

export const handler = createLambdaFunction(appFn, {
    probot: createProbot(),
});