const langToolResult = require("../sample-data/languagetool-response.json");

function createCommentBody(langToolResult) {
    const categoryMatches = {};

    for (let match of langToolResult.matches) {
        const matchProperties = {
            message: match.message,
            context: match.context.text
        };

        if (match.rule.category.name in categoryMatches) {
            if (categoryMatches[match.rule.category.name].length < 3) {
                categoryMatches[match.rule.category.name].push(matchProperties);
            }
        } else {
            categoryMatches[match.rule.category.name] = [];
            categoryMatches[match.rule.category.name].push(matchProperties);
        }
    }

    return categoryMatches;

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