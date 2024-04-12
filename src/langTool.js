const langToolUrl = 'https://api.languagetool.org/v2/check';

async function checkText(text) {
    const res = await fetch(langToolUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            language: 'en-GB',
            text
        })
    });

    const langToolResult = await res.json();

    return langToolResult;
}

module.exports.checkText = checkText;