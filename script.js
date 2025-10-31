// Replace this with your actual Google Apps Script Web App URL
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxpNPM3SsWkdWoU88OajC4YcTxJYoRMGfyDIXSH51gvNwEYxcfAZdMYBQ1nNBHAZ2F3/exec';

async function interpretDream() {
    const input = document.getElementById("dreamInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!input) {
        resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
        return;
    }

    resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dream: input
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        window.latestInterpretation = data.interpretation;
        resultContainer.innerHTML = `<div class="result-box">${data.interpretation}</div>`;
    } catch (error) {
        console.error(error);
        resultContainer.innerHTML = `<div class="result-box">An error occurred while interpreting your dream. Please try again later.</div>`;
        
        // Fallback response
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
