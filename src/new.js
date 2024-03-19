let langToolResult = require("../sample-data/languagetool-response.json");

function createCommentBody(langToolResult) {
    const mistakesCount = langToolResult.matches.length;
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

    let commentBody = `### Total Possible Mistakes: ${mistakesCount} ${mistakesCount >= 3 ? "👎" : "👍"}`;

    if (mistakesCount > 0) {
        commentBody += "\n";

        for (let key in categoryMatches) {
            commentBody += `\n- ${key}: ${categoryMatches[key].length}`;
        }
        commentBody += "\n";

        for (let key in categoryMatches) {
            commentBody += "\n\n";
            commentBody += `##${key}`;

            categoryMatches[key].forEach((e, i) => {
                if (i < 3) {
                    commentBody += `\n> **What:** ${e.message}`;
                    commentBody += `\n> **Where:** ${e.context}`;
                }
            });
        }
    }

    return commentBody;

    // if (langToolResult.matches.length === 0) {
    //     const commentBody = `### Total Mistakes Identified: ${langToolResult.matches.length}`;
    //     return commentBody;
    // } else {
    //     let commentBody = `### Total Mistakes Identified: ${langToolResult.matches.length}`;

    //     for (let mistake of langToolResult.matches) {
    //         let replacements = [];
    //         mistake.replacements.forEach((e, i) => {
    //             if (i <= 3) {
    //                 replacements.push(e.value);
    //             }
    //         });

    //         commentBody += "\n";
    //         commentBody += `> **What:** ${mistake.message}`;
    //         commentBody += "\n";
    //         commentBody += `> **Where:** ${mistake.context.text}`;
    //         commentBody += "\n";
    //         commentBody += `> **Replacements:** ${replacements.join(", ")}`;
    //         commentBody += "\n";
    //     }

    //     return commentBody;
    // }
}

console.log(createCommentBody(langToolResult));