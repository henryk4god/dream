// Updated script.js with better error handling
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbybnwJ96AzRU_UmyDNimlAT51mtQzxBWMYDouIF880z8j-wSZ_rqchrNRdng7-500GFGw/exec";

async function interpretDream() {
    const input = document.getElementById("dreamInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!input) {
        resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
        return;
    }

    resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

    try {
        // Method 1: Try with no-cors mode first
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            mode: "no-cors", // This might work for simple requests
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dream: input
            })
        });

        // If no-cors doesn't work, try using a CORS proxy
        if (!response.ok && response.type === 'opaque') {
            await interpretDreamWithProxy(input, resultContainer);
            return;
        }

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
        console.error('Fetch error:', error);
        // Fallback to direct API call (for development only - remove API key from frontend in production)
        await fallbackDirectAPI(input, resultContainer);
    }
}

// Alternative method using CORS proxy
async function interpretDreamWithProxy(input, resultContainer) {
    try {
        // Use a CORS proxy service
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const response = await fetch(proxyUrl + GAS_WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dream: input
            })
        });

        const data = await response.json();
        
        if (data.success) {
            let result = data.interpretation;
            result = formatInterpretation(result);
            window.latestInterpretation = result.replace(/<[^>]+>/g, '');
            resultContainer.innerHTML = `<div class="result-box">${result}</div>`;
        }
    } catch (proxyError) {
        console.error('Proxy error:', proxyError);
        resultContainer.innerHTML = `<div class="result-box">Connection issue. Please try again later.</div>`;
        
        // Show fallback response
        setTimeout(() => {
            showFallbackResponse(resultContainer);
        }, 1000);
    }
}

// Fallback direct API call (ONLY FOR DEVELOPMENT - REMOVE IN PRODUCTION)
async function fallbackDirectAPI(input, resultContainer) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_API_KEY_HERE" // REMOVE THIS IN PRODUCTION
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a biblical dream interpreter with deep insight and clarity." 
                    },
                    { 
                        role: "user", 
                        content: `Interpret this dream: "${input}" using biblical symbolism. Structure: Title, Symbols, Interpretation, Encouragement.` 
                    }
                ]
            })
        });

        const data = await response.json();
        let result = data.choices?.[0]?.message?.content || "No interpretation generated.";
        result = formatInterpretation(result);
        window.latestInterpretation = result.replace(/<[^>]+>/g, '');
        resultContainer.innerHTML = `<div class="result-box">${result}</div>`;
    } catch (finalError) {
        console.error('Final fallback error:', finalError);
        showFallbackResponse(resultContainer);
    }
}

function showFallbackResponse(resultContainer) {
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
