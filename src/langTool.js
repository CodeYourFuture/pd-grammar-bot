const langToolUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8010/v2/check' : process.env.LANG_TOOL_URL;

async function checkText(pdfText) {
    const res = await fetch(langToolUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            language: 'en-GB',
            text: pdfText
        })
    });

    const langToolResult = await res.json();

    return langToolResult;
}

module.exports.checkText = checkText;