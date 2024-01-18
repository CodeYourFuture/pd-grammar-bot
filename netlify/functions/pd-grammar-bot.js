import { createLambdaFunction, createProbot } from '@probot/adapter-aws-lambda-serverless';

const appFn = (app) => {
    app.on("issue_comment.created", async (context) => {
        console.log(context.payload.comment.body);
    });
};

export const handler = createLambdaFunction(appFn, {
    probot: createProbot(),
});