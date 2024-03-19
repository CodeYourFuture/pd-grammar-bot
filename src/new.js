let langToolResult = require("../sample-data/languagetool-response.json");

function createCommentBody(langToolResult) {
    const mistakesCount = langToolResult.matches.length;
    const categoryMatches = getCategoryMatches(langToolResult);
    const commentBody = generateCommentBody(categoryMatches, mistakesCount);

    return commentBody;
}

function getCategoryMatches(langToolResult) {
    const categoryMatches = {};

    for (let match of langToolResult.matches) {
        const matchProperties = {
            message: match.message,
            context: match.context.text
        };

        if (match.rule.category.name in categoryMatches) {
            categoryMatches[match.rule.category.name].push(matchProperties);
        } else {
            categoryMatches[match.rule.category.name] = [];
            categoryMatches[match.rule.category.name].push(matchProperties);
        }
    }

    return categoryMatches;
}

function generateCommentBody(categoryMatches, mistakesCount) {
    let commentBody = `### Total Possible Mistakes: ${mistakesCount} ${mistakesCount >= 3 ? "👎" : "👍"}`;

    if (mistakesCount > 0) {
        commentBody += "\n";

        for (let key in categoryMatches) {
            commentBody += `\n- ${key}: ${categoryMatches[key].length}`;
        }
        commentBody += "\n";

        for (let key in categoryMatches) {
            commentBody += "\n\n";
            commentBody += `####${key}`;

            categoryMatches[key].forEach((e, i) => {
                if (i < 3) {
                    commentBody += `\n> **What:** ${e.message}`;
                    commentBody += `\n> **Where:** ${e.context}`;
                }
            });
        }

        commentBody += `\n\n### Use a Grammar AI to fix these mistakes.`;
    }

    return commentBody;
}

console.log(createCommentBody(langToolResult));