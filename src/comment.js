function createCommentBody(langToolResult) {
    if (langToolResult.matches.length === 0) {
        const commentBody = `### Total Mistakes Identified: ${langToolResult.matches.length}`;
        return commentBody;
    } else {
        let commentBody = `### Total Mistakes Identified: ${langToolResult.matches.length}`;

        for (let mistake of langToolResult.matches) {
            let replacements = [];
            mistake.replacements.forEach((e, i) => {
                if (i <= 3) {
                    replacements.push(e.value);
                }
            });

            commentBody += "\n";
            commentBody += `> **What:** ${mistake.message}`;
            commentBody += "\n";
            commentBody += `> **Where:** ${mistake.context.text}`;
            commentBody += "\n";
            commentBody += `> **Replacements:** ${replacements.join(", ")}`;
            commentBody += "\n";
        }

        return commentBody;
    }
}

module.exports.createCommentBody = createCommentBody;