function createCommentBody(langToolResult) {
    const commentBody = `Total mistakes: ${langToolResult.matches.length}`;
    return commentBody;
}

module.exports.createCommentBody = createCommentBody;