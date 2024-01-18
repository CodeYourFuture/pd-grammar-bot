import { createLambdaFunction, createProbot } from '@probot/adapter-aws-lambda-serverless';

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        if (context.payload.comment.user.type !== 'Bot') {
            
        }
    });
};

export const handler = createLambdaFunction(appFn, {
    probot: createProbot(),
});