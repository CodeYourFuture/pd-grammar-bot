const mammoth = require("mammoth");

async function getText(commentBody) {
    const fileUrl = getFileUrl(commentBody);

    let res = await fetch(fileUrl);
    const fileBuffer = await res.arrayBuffer();
    
    const text = extractText(fileBuffer);
    
    return text;
}

function getFileUrl(commentBody) {
    const match = commentBody.match(/\.docx]\(([^)]+)\)/);
    return match ? match[1] : null;
}

async function extractText(fileBuffer) {
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });
    const html = result.value;

    const text = html.replaceAll("</p><p>", '\n')
        .replaceAll("</p>", '\n\n')
        .replaceAll("</a>", '')
        .replace(/<\/[^>]*>/g, '\n\n') // closing tags
        .replace(/<[^>]*>/g, '') // opening tags
        .replace(/\n{3,}/g, '\n\n');
    
    return text;
}

module.exports.getText = getText;