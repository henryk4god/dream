const BACKEND_URL = "https://script.google.com/macros/s/AKfycby5fL95cud7D305J1ycH_8hRSTSqHaDak-Yn2_wsMnwSPoSWy3i9nqcw8_4zLJTtscp/exec";

async function interpretDream() {
  const input = document.getElementById("dreamInput").value.trim();
  const resultContainer = document.getElementById("resultContainer");

  if (!input) {
    resultContainer.innerHTML = '<div class="result-box">Please enter a dream to interpret.</div>';
    return;
  }

  resultContainer.innerHTML = '<div class="loading">Interpreting your dream...</div>';

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();
    let result = data.choices?.[0]?.message?.content || "No interpretation generated.";

    result = result.replace(/Title:/g, '👉 Title:')
                   .replace(/Symbols:/g, '✅ Symbols:')
                   .replace(/Interpretation:/g, '✅ Interpretation:')
                   .replace(/Encouragement:/g, '✅ Encouragement:')
                   .replace(/^[\-\*]\s?/gm, '📍')
                   .replace(/\*\*(.*?)\*\*/g, '$1');

    window.latestInterpretation = result.replace(/<[^>]+>/g, '');
    resultContainer.innerHTML = `<div class="result-box">${result}</div>`;
  } catch (err) {
    resultContainer.innerHTML = `<div class="result-box">⚠️ An error occurred. Please try again later.</div>`;
  }
}

function copyResult() {
  if (!window.latestInterpretation) {
    alert("No interpretation to copy yet!");
    return;
  }

  const hiddenClipboard = document.getElementById("hiddenClipboard");
  hiddenClipboard.value = window.latestInterpretation;
  hiddenClipboard.select();
  document.execCommand("copy");
  alert("✅ Interpretation copied to clipboard!");
}
