async function interpretDream() {
  const userInput = document.getElementById('dreamInput').value;
  const responseBox = document.getElementById('result');

  const apiUrl = 'https://script.google.com/macros/s/AKfycbyBADhcbWJke-Ng8znc2-VdTfg9ejazn8ttAFsrE6XwyhFxoTAKIY2B75gCGpMqZyfB/exec';

  responseBox.innerText = "⏳ Interpreting your dream...";

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" }, // 👈 key trick!
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a spiritual dream interpreter." },
        { role: "user", content: userInput }
      ]
    }),
  });

  const data = await res.json();
  responseBox.innerText = data?.choices?.[0]?.message?.content || "⚠️ An error occurred.";
}
