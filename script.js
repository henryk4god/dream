// Google Apps Script endpoint - replace with your deployed web app URL
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbybnwJ96AzRU_UmyDNimlAT51mtQzxBWMYDouIF880z8j-wSZ_rqchrNRdng7-500GFGw/exec";

async function interpretDream() {
    const input = document.getElementById("dreamInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!input) {
        resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
        return;
    }

    resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

    const prompt = `
        You are a wise and compassionate biblical dream interpreter.
        Interpret the following dream with deep clarity, using biblical symbolism, spiritual insights, and psychological reflection.
        Respond in plain text using this structure:

        👉 Title: [short title]
        ✅ Symbols:
        📍Symbol 1: meaning
        📍Symbol 2: meaning
        ✅ Interpretation:
        [paragraphs of interpretation]
        ✅ Encouragement:
        [closing encouragement]

        Here is the dream: "${input}"
    `;

    try {
        // Call Google Apps Script endpoint which handles everything
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                dream: input
            })
        });

        const data = await response.json();
        
        if (data.success) {
            let result = data.interpretation;
            result = formatInterpretation(result);
            window.latestInterpretation = result.replace(/<[^>]+>/g, '');
            resultContainer.innerHTML = `<div class="result-box">${result}</div>`;
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error(error);
        resultContainer.innerHTML = `<div class="result-box">An error occurred while interpreting your dream. Please try again later.</div>`;
        
        // Fallback: Display fake response if API fails
        setTimeout(() => {
            const fakeResponse = `
👉 Title: Climbing a Ladder  
✅ Symbols:  
📍Ladder: spiritual progress  
📍Height: calling or destiny  
✅ Interpretation:  
You are on a journey of spiritual growth. The ladder represents the steps God is leading you to take, one at a time, toward a higher calling.  
✅ Encouragement:  
Don't be afraid of how high you're climbing — you're not alone. Keep stepping in faith!
            `;

            window.latestInterpretation = fakeResponse;
            resultContainer.innerHTML = `<div class="result-box">${fakeResponse}</div>`;
        }, 1000);
    }
}

function formatInterpretation(result) {
    return result.replace(/Title:/g, '👉 Title:')
                 .replace(/Symbols:/g, '✅ Symbols:')
                 .replace(/Interpretation:/g, '✅ Interpretation:')
                 .replace(/Encouragement:/g, '✅ Encouragement:')
                 .replace(/^[\-\*]\s?/gm, '📍')
                 .replace(/\*\*(.*?)\*\*/g, '$1');
}

function copyResult() {
    if (!window.latestInterpretation) {
        alert("No dream interpretation to share yet.");
        return;
    }

    const hiddenClipboard = document.getElementById("hiddenClipboard");
    hiddenClipboard.value = window.latestInterpretation;
    hiddenClipboard.select();
    document.execCommand("copy");
    alert("Interpretation copied! You can now share it anywhere.");
}
