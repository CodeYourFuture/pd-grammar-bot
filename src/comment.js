function createCommentBody(langToolResult) {
    if (langToolResult.matches.length === 0) {
        const commentBody = `### Total Mistakes: ${langToolResult.matches.length}`;
        return commentBody;
    } else {
        
    }
}

module.exports.createCommentBody = createCommentBody;