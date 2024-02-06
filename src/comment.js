function createCommentBody(langToolResult) {
    if (langToolResult.matches.length === 0) {
        const commentBody = `### Total Mistakes: ${langToolResult.matches.length}`;
        return commentBody;
    } else {
        let commentBody = `### Total Mistakes: ${langToolResult.matches.length}`;

        for (let mistake of langToolResult.matches) {
            let replacements = [];
            for (let replacement of mistake.replacements) {
                replacements.push(replacement.value);
            }

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