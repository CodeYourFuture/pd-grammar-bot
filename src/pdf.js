const pdf = require('pdf-parse');

async function getPdfText(commentBody) {
    const pdfUrl = getPdfUrl(commentBody);

    let res = await fetch(pdfUrl);
    const fileBuffer = await res.arrayBuffer();
    
    const pdfData = await pdf(fileBuffer, { pagerender: renderPage });
    
    return pdfData.text;
}

function getPdfUrl(commentBody) {
    const match = commentBody.match(/\.pdf]\(([^)]+)\)/);
    return match ? match[1] : null;
}

function renderPage(pageData) {
    return pageData.getTextContent()
        .then(textContent => {
            let lastY, text = '';
            for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                    text += item.str + ' ';
                }
                else {
                    text += '\n' + item.str + ' ';
                }
                lastY = item.transform[5];
            }
            return text;
        });
}

module.exports.getPdfText = getPdfText;