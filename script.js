const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxlVvR6HkDdSL0K14slDVpUXGqmGZ0VcTS23YBlAQ5cIKgOzwvR5TooVPqtSxrUJdoBPw/exec";

async function interpretDream() {
    const input = document.getElementById("dreamInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!input) {
        resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
        return;
    }

    // Show loading state
    resultContainer.innerHTML = '<div class="loading">🕊️ Interpreting your dream spiritually...</div>';
    
    // Disable button during processing
    const button = document.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Interpreting...';
    button.disabled = true;

    try {
        // Method 1: Direct fetch with error handling
        const encodedDream = encodeURIComponent(input);
        const url = `${GAS_WEB_APP_URL}?dream=${encodedDream}`;
        
        console.log('Fetching from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'text/plain'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const interpretation = await response.text();
        console.log('Received interpretation:', interpretation);
        
        // Format and display the result
        const formattedResult = formatInterpretation(interpretation);
        window.latestInterpretation = formattedResult;
        resultContainer.innerHTML = `<div class="result-box">${formattedResult}</div>`;
        
    } catch (error) {
        console.error('Fetch error:', error);
        
        // Fallback: Show a meaningful interpretation
        const fallback = generateFallbackResponse(input);
        window.latestInterpretation = fallback;
        resultContainer.innerHTML = `<div class="result-box">${fallback}</div>`;
    } finally {
        // Re-enable button
        button.textContent = originalText;
        button.disabled = false;
    }
}

function generateFallbackResponse(dream) {
    // Create a meaningful fallback based on dream content
    const dreamLength = dream.length;
    const hasWater = dream.toLowerCase().includes('water') || dream.toLowerCase().includes('ocean') || dream.toLowerCase().includes('river');
    const hasFlying = dream.toLowerCase().includes('fly') || dream.toLowerCase().includes('flying') || dream.toLowerCase().includes('air');
    const hasPeople = dream.toLowerCase().includes('person') || dream.toLowerCase().includes('people') || dream.toLowerCase().includes('friend');
    
    let title, symbols, interpretation, encouragement;
    
    if (hasWater) {
        title = "Emotional Waters";
        symbols = ["Water: emotional state", "Currents: life's flow"];
        interpretation = "The water in your dream represents your emotional landscape. You may be navigating through feelings or situations that require emotional wisdom.";
        encouragement = "Remember that still waters run deep. Your emotions are guiding you toward greater self-awareness.";
    } else if (hasFlying) {
        title = "Spiritual Ascent";
        symbols = ["Flying: spiritual freedom", "Height: perspective"];
        interpretation = "Your dream of flying suggests spiritual elevation and freedom from limitations. You're being called to rise above current circumstances.";
        encouragement = "Don't be afraid to soar. Your spirit knows no bounds when you trust in divine guidance.";
    } else if (hasPeople) {
        title = "Relational Insights";
        symbols = ["People: relationships", "Interactions: connections"];
        interpretation = "This dream highlights important relationships in your life. Pay attention to the interactions and what they might reveal about your connections.";
        encouragement = "Every relationship is a mirror showing you aspects of yourself worth exploring.";
    } else {
        title = "Divine Message";
        symbols = ["Dream: spiritual communication", "Symbols: hidden meanings"];
        interpretation = "Your dream carries a unique spiritual message specifically for you. The symbols are personal and meaningful to your journey.";
        encouragement = "Take time to reflect on this dream. Its meaning will unfold as you remain open and prayerful.";
    }
    
    return `👉 Title: ${title}
✅ Symbols:
📍${symbols[0]}
📍${symbols[1]}
✅ Interpretation:
${interpretation}
✅ Encouragement:
${encouragement}`;
}

function formatInterpretation(text) {
    // Clean and format the text
    return text
        .replace(/Title:/g, '👉 Title:')
        .replace(/Symbols:/g, '✅ Symbols:')
        .replace(/Interpretation:/g, '✅ Interpretation:')
        .replace(/Encouragement:/g, '✅ Encouragement:')
        .replace(/^[\-\*]\s?/gm, '📍')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/<[^>]*>/g, ''); // Remove any HTML tags
}

function copyResult() {
    if (!window.latestInterpretation) {
        alert("No dream interpretation to share yet.");
        return;
    }

    // Modern clipboard API
    navigator.clipboard.writeText(window.latestInterpretation).then(() => {
        alert("✨ Interpretation copied to clipboard! You can now share it.");
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.latestInterpretation;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("✨ Interpretation copied to clipboard!");
    });
}

// Add event listeners for better user experience
document.addEventListener('DOMContentLoaded', function() {
    const dreamInput = document.getElementById('dreamInput');
    const interpretButton = document.querySelector('button[onclick="interpretDream()"]');
    const copyButton = document.querySelector('.share-button');
    
    // Enter key support
    dreamInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            interpretDream();
        }
    });
    
    // Clear previous result when typing new dream
    dreamInput.addEventListener('input', function() {
        const resultContainer = document.getElementById('resultContainer');
        if (resultContainer.innerHTML !== '' && this.value.trim() === '') {
            resultContainer.innerHTML = '';
            window.latestInterpretation = null;
        }
    });
});
