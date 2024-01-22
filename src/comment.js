function createCommentBody(langToolResult) {
    console.log(langToolResult.matches.length);
    const commentBody = `Total mistakes: ${langToolResult.matches.length}`;
    return commentBody;
}

module.exports.createCommentBody = createCommentBody;