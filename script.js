async function interpretDream() {
  const input = document.getElementById("dreamInput").value.trim();
  const resultContainer = document.getElementById("resultContainer");

  if (!input) {
    resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
    return;
  }

  resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxpNPM3SsWkdWoU88OajC4YcTxJYoRMGfyDIXSH51gvNwEYxcfAZdMYBQ1nNBHAZ2F3/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dream: input })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Interpretation failed");
    }

    let result = data.message || "No interpretation generated.";
    result = result
      .replace(/Title:/g, '👉 Title:')
      .replace(/Symbols:/g, '✅ Symbols:')
      .replace(/Interpretation:/g, '✅ Interpretation:')
      .replace(/Encouragement:/g, '✅ Encouragement:')
      .replace(/^[\-\*]\s?/gm, '📍')
      .replace(/\*\*(.*?)\*\*/g, '$1');

    window.latestInterpretation = result.replace(/<[^>]+>/g, '');
    resultContainer.innerHTML = `<div class="result-box">${result}</div>`;

  } catch (error) {
    console.error(error);
    resultContainer.innerHTML = `<div class="result-box">An error occurred while interpreting your dream. Please try again later.</div>`;
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
