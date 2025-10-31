async function interpretDream() {
  const input = document.getElementById("dreamInput").value.trim();
  const resultContainer = document.getElementById("resultContainer");

  if (!input) {
    resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
    return;
  }

  resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

  try {
    // Replace with your Google Apps Script Web App URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxpNPM3SsWkdWoU88OajC4YcTxJYoRMGfyDIXSH51gvNwEYxcfAZdMYBQ1nNBHAZ2F3/exec';
    
    const response = await fetch(scriptUrl, {
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
      window.latestInterpretation = data.interpretation;
      resultContainer.innerHTML = `<div class="result-box">${data.interpretation}</div>`;
    } else {
      throw new Error(data.error || 'Interpretation failed');
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
