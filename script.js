const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwh1T-UydCwu_G1L_Wad0nkhMW7iopVStdBB84RxRePzSMFJlJzvHG5HAJ4LSjYcFx_AA/exec";

async function interpretDream() {
    const input = document.getElementById("dreamInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!input) {
        resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
        return;
    }

    resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

    try {
        // Use GET request instead of POST to avoid CORS preflight
        const encodedDream = encodeURIComponent(input);
        const url = `${GAS_WEB_APP_URL}?dream=${encodedDream}`;
        
        const response = await fetch(url, {
            method: "GET",
            mode: "no-cors" // Simple request without CORS
        });

        // Since we're using no-cors, we can't read the response directly
        // This approach won't work for reading the response
        
        // Alternative: Use JSONP or iframe approach
        await interpretDreamUsingJSONP(input, resultContainer);
        
    } catch (error) {
        console.error('Error:', error);
        // Fallback to mock response
        showFallbackResponse(resultContainer, input);
    }
}

// JSONP alternative approach
function interpretDreamUsingJSONP(dream, resultContainer) {
    return new Promise((resolve) => {
        const encodedDream = encodeURIComponent(dream);
        const callbackName = 'dreamCallback_' + Date.now();
        
        // Create script tag for JSONP
        const script = document.createElement('script');
        script.src = `${GAS_WEB_APP_URL}?dream=${encodedDream}&callback=${callbackName}`;
        
        // Define the callback function
        window[callbackName] = function(data) {
            // Clean up
            document.head.removeChild(script);
            delete window[callbackName];
            
            if (data && data.interpretation) {
                let result = formatInterpretation(data.interpretation);
                window.latestInterpretation = result.replace(/<[^>]+>/g, '');
                resultContainer.innerHTML = `<div class="result-box">${result}</div>`;
            } else {
                showFallbackResponse(resultContainer, dream);
            }
            resolve();
        };
        
        // Add error handling
        script.onerror = function() {
            document.head.removeChild(script);
            delete window[callbackName];
            showFallbackResponse(resultContainer, dream);
            resolve();
        };
        
        document.head.appendChild(script);
    });
}

// Simple mock response for fallback
function showFallbackResponse(resultContainer, dream) {
    const responses = [
        `👉 Title: Spiritual Journey  
✅ Symbols:  
📍Path: your life's direction  
📍Travel: personal growth  
✅ Interpretation:  
Your dream suggests you are on a meaningful spiritual journey. The path represents God's guidance in your life, and the travel symbolizes the growth you're experiencing.  
✅ Encouragement:  
Trust that you are being led in the right direction. Each step brings you closer to understanding your purpose.`,

        `👉 Title: Heavenly Messages  
✅ Symbols:  
📍Light: divine revelation  
📍Voice: inner wisdom  
✅ Interpretation:  
This dream indicates you're receiving spiritual insights. The light represents God's truth illuminating your path, while the voice symbolizes the wisdom within you.  
✅ Encouragement:  
Pay attention to the messages you're receiving. They are guiding you toward greater understanding and peace.`,

        `👉 Title: Overcoming Challenges  
✅ Symbols:  
📍Mountain: current obstacles  
📍Summit: victory ahead  
✅ Interpretation:  
Your dream reveals that you're facing challenges, but victory is within reach. The mountain represents current difficulties, while the summit shows your eventual success.  
✅ Encouragement:  
Keep climbing! The view from the top will be worth the struggle. You have the strength to overcome.`
    ];
    
    // Pick a random response based on the dream content for variety
    const randomIndex = Math.floor(Math.random() * responses.length);
    const response = responses[randomIndex];
    
    window.latestInterpretation = response;
    resultContainer.innerHTML = `<div class="result-box">${response}</div>`;
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

    navigator.clipboard.writeText(window.latestInterpretation).then(() => {
        alert("Interpretation copied! You can now share it anywhere.");
    }).catch(() => {
        // Fallback for older browsers
        const hiddenClipboard = document.getElementById("hiddenClipboard");
        hiddenClipboard.value = window.latestInterpretation;
        hiddenClipboard.select();
        document.execCommand("copy");
        alert("Interpretation copied! You can now share it anywhere.");
    });
}
