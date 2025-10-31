// Replace this with your actual Google Apps Script Web App URL
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxvTSA17Nqu1wtSQTdeemApS3AIn0Yj4IonBcvpahI9YRlGTj4hxD1MKwi7d38hQulN/exec';

async function interpretDream() {
    const input = document.getElementById("dreamInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!input) {
        resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
        return;
    }

    resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

    try {
        // JSONP approach: create a unique callback and inject a <script> tag.
        console.log('Sending JSONP request to:', GAS_WEB_APP_URL);

        const callbackName = '__dreamCallback_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        let timedOut = false;

        // Setup global callback
        window[callbackName] = function(data) {
            if (timedOut) return;
            cleanup();

            if (!data) {
                onError(new Error('No data received'));
                return;
            }

            if (data.error) {
                onError(new Error(data.error));
                return;
            }

            window.latestInterpretation = data.interpretation;
            resultContainer.innerHTML = `<div class="result-box">${data.interpretation}</div>`;
        };

        // Error handler
        function onError(err) {
            console.error(err);
            resultContainer.innerHTML = `<div class="result-box">An error occurred while interpreting your dream. Please try again later.</div>`;

            // fallback response
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

        // Cleanup script tag and callback
        const script = document.createElement('script');
        function cleanup() {
            try { if (script.parentNode) script.parentNode.removeChild(script); } catch (e) {}
            try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
            clearTimeout(timeoutHandle);
        }

        // Timeout in case the script fails to load or callback never called
        const timeoutHandle = setTimeout(() => {
            timedOut = true;
            cleanup();
            onError(new Error('Request timed out'));
        }, 10000); // 10s

        script.src = GAS_WEB_APP_URL + '?dream=' + encodeURIComponent(input) + '&callback=' + callbackName;
        script.async = true;
        script.onerror = function(evt) {
            timedOut = true;
            cleanup();
            onError(new Error('Script load error'));
        };

        document.body.appendChild(script);

    } catch (error) {
        console.error(error);
        resultContainer.innerHTML = `<div class="result-box">An unexpected error occurred. Please try again later.</div>`;
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
